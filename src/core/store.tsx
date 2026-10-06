import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { requestRepository, type AppRequest } from '../data/requests';

interface RequestsValue {
  requests: AppRequest[];
  loading: boolean;
  create: (
    input: Omit<AppRequest, 'id' | 'reference' | 'status' | 'timeline' | 'createdAt'>,
  ) => Promise<AppRequest>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  byId: (id: string) => AppRequest | undefined;
}

const RequestsContext = createContext<RequestsValue | null>(null);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    requestRepository.list().then((items) => {
      if (!active) return;
      setRequests(items);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const create = useCallback<RequestsValue['create']>(async (input) => {
    const created = await requestRepository.create(input);
    setRequests(await requestRepository.list());
    return created;
  }, []);

  const remove = useCallback(async (id: string) => {
    await requestRepository.remove(id);
    setRequests(await requestRepository.list());
  }, []);

  const clear = useCallback(async () => {
    await requestRepository.clear();
    setRequests([]);
  }, []);

  const value = useMemo<RequestsValue>(
    () => ({
      requests,
      loading,
      create,
      remove,
      clear,
      byId: (id) => requests.find((r) => r.id === id),
    }),
    [requests, loading, create, remove, clear],
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequests(): RequestsValue {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}

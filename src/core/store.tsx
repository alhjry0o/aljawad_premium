import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode, useEffect,
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
  markRequestAsSeen: (id: string, status: string) => void; // ✅
  hasUnreadUpdate: (request: AppRequest) => boolean;      // ✅
}

const RequestsContext = createContext<RequestsValue | null>(null);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AppRequest[]>([]);
 // ✅ حالة لتتبع الحالات التي رآها المستخدم
  const [seenStatuses, setSeenStatuses] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('aljawad.seenStatuses') || '{}');
    } catch {
      return {};
    }
  });

  // ✅ دالة لحفظ الحالة كـ "مقروءة" عند فتح الطلب
  const markRequestAsSeen = (id: string, status: string) => {
    setSeenStatuses((prev) => {
      const updated = { ...prev, [id]: status };
      localStorage.setItem('aljawad.seenStatuses', JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ دالة للتحقق مما إذا كان الطلب يحتوي على تحديث جديد
  const hasUnreadUpdate = (request: any) => {
    return seenStatuses[request.id] !== request.status;
  };
  
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
      markRequestAsSeen,
      hasUnreadUpdate,
    }),
    [requests, loading, create, remove, clear, seenStatuses],
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequests(): RequestsValue {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}

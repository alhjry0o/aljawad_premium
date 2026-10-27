import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  markRequestAsSeen: (id: string, status: string) => void; 
  hasUnreadUpdate: (request: AppRequest) => boolean;      
}

const RequestsContext = createContext<RequestsValue | null>(null);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [seenStatuses, setSeenStatuses] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('aljawad.seenStatuses') || '{}');
    } catch {
      return {};
    }
  });

  // ✅ المزامنة اللحظية مع Firebase
  useEffect(() => {
    // جلب البيانات المحلية أولاً (للتجربة السريعة)
    requestRepository.list().then((items) => {
      setRequests(items);
    });

    // الاستماع للتحديثات من Firebase
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteRequests = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id, // استخدام معرف Firebase
          // تحويل التاريخ من رقم إلى نص متوافق مع النوع AppRequest
          createdAt: new Date(data.createdAt).toISOString(), 
          timeline: [{ status: data.status || 'submitted', at: new Date().toISOString() }],
          kind: data.kind || 'service',
          photos: data.photos || [],
          location: data.location || { city: '', district: '', address: '' },
          contact: data.contact || { name: '', phone: '' },
        } as AppRequest;
      });

      setRequests((prevLocal) => {
        // دمج الطلبات البعيدة مع المحلية
        const merged = [...remoteRequests];
        
        // إضافة الطلبات المحلية التي لم تصل إلى Firebase بعد
        prevLocal.forEach((localReq) => {
          if (!merged.find((r) => r.reference === localReq.reference)) {
            merged.push(localReq);
          }
        });
        
        return merged.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markRequestAsSeen = useCallback((id: string, status: string) => {
    setSeenStatuses((prev) => {
      if (prev[id] === status) return prev;
      const updated = { ...prev, [id]: status };
      localStorage.setItem('aljawad.seenStatuses', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const hasUnreadUpdate = useCallback((request: any) => {
    return seenStatuses[request.id] !== request.status;
  }, [seenStatuses]);

  const create = useCallback<RequestsValue['create']>(async (input) => {
    const created = await requestRepository.create(input);
    // لا نقوم بتحديث الحالة هنا، الاستماع في Firebase سيقوم بذلك
    return created;
  }, []);

  const remove = useCallback(async (id: string) => {
    await requestRepository.remove(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
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
    [requests, loading, create, remove, clear, seenStatuses, markRequestAsSeen, hasUnreadUpdate],
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequests(): RequestsValue {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}

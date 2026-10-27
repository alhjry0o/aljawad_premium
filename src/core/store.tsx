import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
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
const INSTALL_TIME_KEY = 'aljawad.install_time'; // ✅ نفس مفتاح وقت التثبيت

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ جلب وقت التثبيت (مشترك مع الإشعارات)
  const [installTime] = useState<number>(() => {
    const saved = localStorage.getItem(INSTALL_TIME_KEY);
    if (saved) return Number(saved);
    const now = Date.now();
    localStorage.setItem(INSTALL_TIME_KEY, String(now));
    return now;
  });

  const [seenStatuses, setSeenStatuses] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('aljawad.seenStatuses') || '{}');
    } catch {
      return {};
    }
  });

  // ✅ المزامنة اللحظية مع Firebase مع فلترة الوقت
  useEffect(() => {
    // 1. جلب الطلبات المحلية (التي أنشأها المستخدم بعد التثبيت)
    requestRepository.list().then((items) => {
      const filteredLocal = items.filter(i => new Date(i.createdAt).getTime() >= installTime);
      setRequests(filteredLocal);
    });

    // 2. الاستماع للطلبات من Firebase (التي تم إنشاؤها بعد التثبيت فقط)
    const q = query(
      collection(db, 'requests'), 
      where('createdAt', '>=', installTime),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteRequests = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id, 
          createdAt: new Date(data.createdAt).toISOString(), 
          timeline: [{ status: data.status || 'submitted', at: new Date().toISOString() }],
          kind: data.kind || 'service',
          photos: data.photos || [],
          location: data.location || { city: '', district: '', address: '' },
          contact: data.contact || { name: '', phone: '' },
        } as AppRequest;
      });

      setRequests((prevLocal) => {
        // دمج الطلبات القادمة من Firebase مع الطلبات المحلية
        const merged = [...remoteRequests];
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
  }, [installTime]);

  const markRequestAsSeen = useCallback((id: string, status: string) => {
    setSeenStatuses((prev) => {
      if (prev[id] === status) return prev;
      const updated = { ...prev, [id]: status };
      localStorage.setItem('aljawad.seenStatuses', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const hasUnreadUpdate = useCallback((request: any) => {
    const seen = seenStatuses[request.id];
    if (!seen) {
      // إذا لم نره من قبل، نعتبره مقروءاً إذا كان 'submitted' (طلب جديد أنشأه المستخدم)
      // وإلا فهو غير مقروء (بسبب تحديث من الإدارة)
      return request.status !== 'submitted'; 
    }
    return seen !== request.status;
  }, [seenStatuses]);

  const create = useCallback<RequestsValue['create']>(async (input) => {
    const created = await requestRepository.create(input);
    
    // ✅ إضافة الطلب فوراً للواجهة لكي تعمل شاشة النجاح (تحتوي على البيانات والزر)
    setRequests(prev => [created, ...prev]);
    
    // ✅ اعتبار الطلب الجديد مقروءاً فوراً (لا تظهر عليه نقطة حمراء)
    markRequestAsSeen(created.id, 'submitted');
    
    return created;
  }, [markRequestAsSeen]);

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

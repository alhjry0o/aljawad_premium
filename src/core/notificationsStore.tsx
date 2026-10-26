import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);
const STORAGE_KEY = 'aljawad.notifications_read';
const INSTALL_TIME_KEY = 'aljawad.install_time'; // ✅ مفتاح لحفظ وقت أول تثبيت

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [remoteNotifications, setRemoteNotifications] = useState<AppNotification[]>([]);
  
  // ✅ جلب أو إنشاء وقت التثبيت
  const [installTime] = useState<number>(() => {
    const saved = localStorage.getItem(INSTALL_TIME_KEY);
    if (saved) return Number(saved);
    const now = Date.now();
    localStorage.setItem(INSTALL_TIME_KEY, String(now));
    return now;
  });

  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ✅ الاستماع المباشر للإشعارات من Firebase، مع فلترة القديم
  useEffect(() => {
    // نجلب الإشعارات التي أُرسلت فقط بعد تاريخ تثبيت التطبيق
    const q = query(
      collection(db, 'notifications'), 
      where('createdAt', '>=', installTime),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        body: doc.data().body,
        date: doc.data().createdAt,
        read: false,
      }));
      setRemoteNotifications(data);
    });
    return () => unsub();
  }, [installTime]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
  }, [readIds]);

  const notifications = remoteNotifications.map(n => ({
    ...n,
    read: readIds.includes(n.id)
  }));

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(prev => Array.from(new Set([...prev, ...allIds])));
  };

  const deleteNotification = (id: string) => {
    setReadIds(prev => [...prev, id]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationsStore() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationsStore must be used within NotificationProvider');
  return ctx;
}

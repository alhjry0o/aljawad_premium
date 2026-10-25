import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [remoteNotifications, setRemoteNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ✅ الاستماع المباشر للإشعارات من Firebase
  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        body: doc.data().body,
        date: doc.data().createdAt,
        read: false, // سيتم تحديدها بناءً على readIds
      }));
      setRemoteNotifications(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
  }, [readIds]);

  // دمج الإشعارات البعيدة مع حالة القراءة المحلية
  const notifications = remoteNotifications.map(n => ({
    ...n,
    read: readIds.includes(n.id)
  }));

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(prev => Array.from(new Set([...prev, ...allIds])));
  };

  const deleteNotification = (id: string) => {
    // الحذف من الواجهة فقط (لأن الإشعار في قاعدة البيانات مشترك)
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

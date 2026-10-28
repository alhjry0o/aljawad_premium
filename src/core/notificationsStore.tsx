import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
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
const INSTALL_TIME_KEY = 'aljawad.install_time';
const DELETED_KEY = 'aljawad.notifications_deleted'; // ✅ السطر الناقص

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [remoteNotifications, setRemoteNotifications] = useState<AppNotification[]>([]);
  
  const [installTime] = useState<number>(() => {
    const saved = localStorage.getItem(INSTALL_TIME_KEY);
    const DELETED_KEY = 'aljawad.notifications_deleted';
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
  
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(DELETED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }); 
  
  // 1️⃣ التأثير الخاص بجلب الإشعارات من Firebase
  useEffect(() => {
    let unsub = () => {};
    try {
      // ✅ جلب آخر 50 إشعار بدون تعقيدات الفهارس
      const q = query(
        collection(db, 'notifications'), 
        orderBy('createdAt', 'desc'),
        limit(50) 
      );

      unsub = onSnapshot(
        q, 
        (snap) => {
          const data = snap.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            date: doc.data().createdAt,
            read: false,
          })).filter(d => d.date >= installTime); // ✅ فلترة محلية
          
          setRemoteNotifications(data);
        },
        (error) => {
          console.warn("Firebase Notifications Query Error:", error.message);
        }
      );
    } catch (err) {
      console.error("Sync error in notifications query:", err);
    }
    
    return () => unsub();
  }, [installTime]);

  // 2️⃣ التأثير الخاص بحفظ الإشعارات المقروءة في الذاكرة
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
  }, [readIds]);

  // 3️⃣ التأثير الخاص بحفظ الإشعارات المحذوفة في الذاكرة
  useEffect(() => {
    localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
  }, [deletedIds]);

  const notifications = useMemo(() => {
    return remoteNotifications
      .filter(n => !deletedIds.includes(n.id)) // ✅ تصفية المحذوفات
      .map(n => ({
        ...n,
        read: readIds.includes(n.id)
      }));
  }, [remoteNotifications, readIds, deletedIds]);

  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    setReadIds(prev => {
      const newIds = Array.from(new Set([...prev, ...allIds]));
      return newIds.length === prev.length ? prev : newIds;
    });
  }, [notifications]);

  const deleteNotification = useCallback((id: string) => {
    setDeletedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(() => ({
    notifications, unreadCount, markAllAsRead, deleteNotification
  }), [notifications, unreadCount, markAllAsRead, deleteNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationsStore() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationsStore must be used within NotificationProvider');
  return ctx;
}

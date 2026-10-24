import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: number;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);
const STORAGE_KEY = 'aljawad.notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // ✅ التأكد من أن البيانات مصفوفة وليست شيئاً آخر
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to parse notifications from localStorage', error);
      return []; // في حال فشل القراءة، نبدأ بمصفوفة فارغة
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    setNotifications((prev) => {
      // منع التكرار بناءً على العنوان والنص والتاريخ (إذا كان خلال 5 ثواني)
      const isDuplicate = prev.some(
        (n) => n.title === notif.title && n.body === notif.body && Date.now() - n.date < 5000
      );
      if (isDuplicate) return prev;

      const newNotif: AppNotification = {
        ...notif,
        id: Math.random().toString(36).substr(2, 9),
        date: Date.now(),
        read: false,
      };
      return [newNotif, ...prev];
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllAsRead, deleteNotification }}
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

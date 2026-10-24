import { useState } from 'react';
import { useNotificationsStore, type AppNotification } from '../../core/notificationsStore';
import { useI18n } from '../../core/i18n';
import { Glyph } from '../../components/icons';
import { ScreenHeader } from '../../components/kit';

export function NotificationsScreen() {
  const { t, bi } = useI18n();
  const { notifications, deleteNotification } = useNotificationsStore();
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [pressTimer, setPressTimer] = useState<any>(null);

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const timer = setTimeout(() => {
      setContextMenu({ id, x: clientX, y: clientY });
    }, 600); // 600ms للضغط المطول
    setPressTimer(timer);
  };

  const handlePressEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  const handleCopy = (notif: AppNotification) => {
    navigator.clipboard.writeText(`${notif.title}\n${notif.body}`);
    setContextMenu(null);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    setContextMenu(null);
  };

  return (
    <div className="pb-32 min-h-screen">
      <ScreenHeader title={bi({ ar: 'الإشعارات', en: 'Notifications' })} />
      
      <div className="p-5 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-[color:var(--muted)]">
            <Glyph name="bell" size={48} className="mx-auto mb-4 opacity-50" />
            <p>{bi({ ar: 'لا توجد إشعارات حالياً', en: 'No notifications yet' })}</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onMouseDown={(e) => handlePressStart(e, notif.id)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={(e) => handlePressStart(e, notif.id)}
              onTouchEnd={handlePressEnd}
              className={`relative p-4 rounded-[16px] border backdrop-blur-xl transition-all ${
                notif.read 
                  ? 'bg-white/[0.02] border-white/5' 
                  : 'bg-[color:var(--primary)]/10 border-[color:var(--primary)]/30'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-[0.95rem] font-bold ${notif.read ? 'text-white/70' : 'text-white'}`}>
                  {notif.title}
                </h3>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-[color:var(--primary)] mt-1.5 shrink-0" />}
              </div>
              <p className={`text-[0.85rem] ${notif.read ? 'text-white/50' : 'text-white/80'}`}>
                {notif.body}
              </p>
              <span className="block mt-2 text-[0.65rem] text-white/30" dir="ltr">
                {new Date(notif.date).toLocaleString('ar-SA')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* قائمة الخيارات (حذف / نسخ) */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div 
            className="fixed z-50 glass-panel rounded-xl overflow-hidden shadow-xl border border-white/20 flex flex-col min-w-[120px]"
            style={{ top: Math.min(contextMenu.y, window.innerHeight - 120), left: Math.min(contextMenu.x, window.innerWidth - 140) }}
          >
            <button 
              onClick={() => {
                const notif = notifications.find(n => n.id === contextMenu.id);
                if (notif) handleCopy(notif);
              }}
              className="px-4 py-3 text-sm text-white hover:bg-white/10 flex items-center gap-2 text-start"
            >
              <Glyph name="quote" size={14} /> {bi({ ar: 'نسخ', en: 'Copy' })}
            </button>
            <div className="h-px bg-white/10" />
            <button 
              onClick={() => handleDelete(contextMenu.id)}
              className="px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 text-start"
            >
              <Glyph name="close" size={14} /> {bi({ ar: 'حذف', en: 'Delete' })}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

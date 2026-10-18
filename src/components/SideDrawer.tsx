import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../core/i18n';
import { useNav, type TabKey } from '../core/navigation';
import { useCompany } from '../core/companyStore';
import { BrandMark, Glyph, type GlyphName } from './icons';
import { cn } from '../utils/cn';

const MENU_ITEMS: { id: TabKey; labelKey: any; icon: GlyphName }[] = [
  { id: 'home', labelKey: 'nav.home', icon: 'home' },
  { id: 'services', labelKey: 'nav.services', icon: 'grid' },
  { id: 'projects', labelKey: 'nav.projects', icon: 'layers' },
  { id: 'requests', labelKey: 'nav.requests', icon: 'receipt' },
  { id: 'more', labelKey: 'nav.more', icon: 'menu' },
];

export function SideDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, bi, lang, setLang } = useI18n();
  const { tab, goTab, push } = useNav();
  const { config: appConfig } = useCompany();

  // إغلاق القائمة عند الضغط على زر الرجوع في الهاتف (اختياري، لكن جيد للتجربة)
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[100] transition-opacity duration-300',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'absolute inset-y-0 start-0 flex w-[75%] max-w-[320px] flex-col bg-[color:var(--bg)]/90 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-e border-white/10',
          open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full',
        )}
      >
        {/* ============ Header ============ */}
        <div className="relative overflow-hidden px-6 pb-8 pt-[calc(env(safe-area-inset-top)+2rem)]">
          {/* Soft glow behind logo */}
          <div
            className="pointer-events-none absolute -top-10 start-1/4 h-40 w-40 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
          />

          <div className="relative flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-2xl"
                style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
              />
              <BrandMark size={44} className="drop-shadow-[0_10px_24px_rgba(43,211,140,0.3)]" />
            </div>
            <div className="min-w-0">
              <div className="text-[1.05rem] font-extrabold tracking-tight text-white">
                {bi(appConfig.appName)}
              </div>
              <div className="mt-0.5 text-[0.62rem] uppercase tracking-[0.22em] text-white/40">
                ALJAWAD SERVICES
              </div>
            </div>
          </div>
        </div>

        {/* ============ Menu Items ============ */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1.5">
            {MENU_ITEMS.map((item) => {
              const active = tab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      goTab(item.id);
                      onClose();
                    }}
                    className={cn(
                      'group flex w-full items-center gap-4 rounded-[14px] px-4 py-3.5 text-start transition-all duration-300',
                      active
                        ? 'border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 text-[color:var(--primary)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                        : 'border border-transparent text-white/60 hover:bg-white/[0.04] hover:text-white/90',
                    )}
                  >
                    <Glyph
                      name={item.icon}
                      size={20}
                      strokeWidth={active ? 2 : 1.6}
                      className={cn(
                        'shrink-0 transition-colors',
                        active ? 'drop-shadow-[0_0_8px_var(--glow)]' : 'text-white/40 group-hover:text-white/70',
                      )}
                    />
                    <span className={cn('text-[0.92rem]', active ? 'font-bold' : 'font-semibold')}>
                      {t(item.labelKey)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ============ Footer ============ */}
        <div className="mt-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-6">
          {/* Divider */}
          <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Language Toggle Capsule */}
          <button
            type="button"
            onClick={() => {
              setLang(lang === 'ar' ? 'en' : 'ar');
            }}
            className="flex w-full items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
          >
            <span className="flex items-center gap-2 text-[0.82rem] font-semibold text-white/80">
              <Glyph name="globe" size={16} className="text-[color:var(--primary)]" />
              {bi({ ar: 'تغيير اللغة', en: 'Change Language' })}
            </span>
            <span className="rounded-full bg-[color:var(--primary)]/15 px-2.5 py-1 text-[0.68rem] font-bold text-[color:var(--primary)]">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* Bottom Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.72rem] font-medium text-white/35">
            <button
              type="button"
              onClick={() => {
                push({ name: 'privacy' });
                onClose();
              }}
              className="transition-colors hover:text-white/70"
            >
              {t('more.privacy')}
            </button>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <button
              type="button"
              onClick={() => {
                push({ name: 'terms' });
                onClose();
              }}
              className="transition-colors hover:text-white/70"
            >
              {t('more.terms')}
            </button>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <button
              type="button"
              onClick={() => {
                push({ name: 'contact' });
                onClose();
              }}
              className="transition-colors hover:text-white/70"
            >
              {t('contact.title')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

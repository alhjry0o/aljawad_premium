import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { I18nProvider, useI18n } from './core/i18n';
import { ThemeProvider } from './core/theme';
import { NavigationProvider, useNav, type TabKey } from './core/navigation';
import { RequestsProvider } from './core/store';
import { ProjectsProvider } from './core/projectsStore';
import { CompanyProvider } from './core/companyStore';  
import { Glyph, type GlyphName } from './components/icons';
import { Toast } from './components/kit';
import { HomeScreen } from './features/home/HomeScreen';
import { ServicesScreen } from './features/services/ServicesScreen';
import { ServiceDetailScreen } from './features/services/ServiceDetailScreen';
import { RequestFlowScreen } from './features/request/RequestFlowScreen';
import {
  RequestDetailScreen,
  RequestsScreen,
  SuccessScreen,
} from './features/request/RequestsScreens';
import { ProjectDetailScreen, ProjectsScreen } from './features/projects/ProjectsScreens';
import {
  AboutScreen,
  ContactScreen,
  DeveloperScreen,
  FaqScreen,
  LegalScreen,
  MoreScreen,
  SettingsScreen,
} from './features/more/MoreScreens';
import { cn } from './utils/cn';
import { OnboardingScreen, ONBOARDING_KEY } from './features/onboarding/OnboardingScreen';
import { DrawerProvider, useDrawer } from './core/drawer';
import { SideDrawer } from './components/SideDrawer';
import { useEffect } from 'react'; 
import { NotificationProvider, useNotificationsStore } from './core/notificationsStore';
import { setupPushNotifications, clearSystemNotifications } from './core/notifications';
import { NotificationsScreen } from './features/more/NotificationsScreen';

/* ----------------------------------------------------- Bottom navigation */

const MAIN_TAB_ROUTES = ['home', 'services', 'requests', 'projects', 'more'] as const;
const isMainTabRoute = (name: string) =>
  (MAIN_TAB_ROUTES as readonly string[]).includes(name);

const TABS: { key: TabKey; icon: GlyphName; labelKey: Parameters<ReturnType<typeof useI18n>['t']>[0] }[] = [
  { key: 'home', icon: 'home', labelKey: 'nav.home' },
  { key: 'services', icon: 'grid', labelKey: 'nav.services' },
  { key: 'requests', icon: 'receipt', labelKey: 'nav.requests' },
  { key: 'projects', icon: 'layers', labelKey: 'nav.projects' },
  { key: 'more', icon: 'menu', labelKey: 'nav.more' },
];

function BottomNav() {
  const { tab, goTab, route } = useNav();
  const { t } = useI18n();
  const { unreadCount } = useNotificationsStore(); // ✅ جلب عدد الإشعارات غير المقروءة
  const { requests, hasUnreadUpdate } = useRequests();
  const hasUnreadRequests = requests.some(r => hasUnreadUpdate(r));

  if (!isMainTabRoute(route.name)) return null;

  const index = TABS.findIndex((item) => item.key === tab);
  const activePercent = (index < 0 ? 0 : index) * (100 / TABS.length);
  const tabCenterPercent = activePercent + 100 / TABS.length / 2;

  return (
    <nav
      aria-label={t('nav.home')}
      className="hide-on-keyboard pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),1.1rem)]"
    >
      <div className="pointer-events-auto relative mx-auto max-w-[92vw]">
        
        {/* 1. هالة النيون الخلفية العميقة */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-full opacity-50 blur-3xl transition-all duration-500"
          style={{
            background: 'radial-gradient(80% 100% at 50% 70%, var(--glow), transparent 70%)',
          }}
        />

        {/* 2. الشريط الزجاجي الاحترافي */}
        <div className="relative overflow-hidden rounded-full border border-white/15 bg-[color:var(--elevated)]/45 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.4)] backdrop-blur-3xl">
          
          {/* خط لمعان زجاجي علوي حاد */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          {/* توهج النيون الأرضي المتحرك */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 h-8 w-16 rounded-full opacity-80 blur-xl transition-[inset-inline-start] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{
              background: 'radial-gradient(circle at 50% 100%, var(--primary), transparent 75%)',
              insetInlineStart: `calc(${tabCenterPercent}% - 32px)`,
            }}
          />

          <ul className="relative flex items-center gap-1.5 px-3 py-2">
            {TABS.map((item) => {
              const active = item.key === tab;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => goTab(item.key)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex flex-col items-center justify-center gap-1 rounded-full px-4 py-2.5 transition-all duration-300 active:scale-[0.90]',
                      active
                        ? 'bg-gradient-to-b from-white/10 to-transparent text-[color:var(--primary)] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.05)] font-bold'
                        : 'text-[color:var(--faint)] hover:text-white/80',
                    )}
                  >
                    {/* 4. محاكي الأيقونة ثلاثية الأبعاد */}
                    {/* ✅ أضفنا 'relative' هنا لكي تتمركز النقطة الحمراء بشكل صحيح */}
                    <div 
                      className={cn(
                        "relative transition-all duration-300 transform",
                        active ? "scale-110 -translate-y-0.5 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                      )}
                    >
                      <Glyph 
                        name={item.icon} 
                        size={active ? 20 : 18} 
                        strokeWidth={active ? 2.2 : 1.5} 
                        style={active ? { filter: 'drop-shadow(0 0 5px var(--primary))' } : undefined}
                      />

                     {/* النقطة الحمراء لتبويب طلباتي */}
                     {item.key === 'requests' && hasUnreadRequests && (
                       <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#0d1a17]"></span>
                       </span>
                     )}

                      {/* ✅ النقطة الحمراء للإشعارات غير المقروءة (تظهر فقط على زر المزيد) */}
                      {item.key === 'more' && unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#0d1a17]"></span>
                        </span>
                      )}
                    </div>

                    {/* النص التوضيحي */}
                    <span
                      className={cn(
                        'text-[0.6rem] tracking-wide transition-all duration-300 font-medium',
                        active ? 'text-[color:var(--primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] text-[0.62rem]' : 'text-[color:var(--faint)]',
                      )}
                    >
                      {t(item.labelKey)}
                    </span>

                    {/* مؤشر نقطي مضيء متوهج أسفل النص */}
                    {active && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[color:var(--primary)] shadow-[0_0_8px_var(--primary)] animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}


/* ----------------------------------------------------- Android back button */

function useAndroidBackButton() {
  const { route, canGoBack, back, goTab } = useNav();
  const { lang } = useI18n();
  const [toast, setToast] = useState<string | null>(null);
  const lastPressRef = useRef(0);
  const stateRef = useRef({ route, canGoBack, back, goTab, lang });

  useEffect(() => {
    stateRef.current = { route, canGoBack, back, goTab, lang };
  }, [route, canGoBack, back, goTab, lang]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: { remove: () => void } | undefined;
    let cancelled = false;

    CapacitorApp.addListener('backButton', () => {
      const s = stateRef.current;
      const isMain = isMainTabRoute(s.route.name);
      const isHome = s.route.name === 'home';

      // 1. في شاشة فرعية ← ارجع للخلف
      if (s.canGoBack) {
        s.back();
        return;
      }

      // 2. في تبويب غير الرئيسية ← اذهب للرئيسية
      if (isMain && !isHome) {
        s.goTab('home');
        return;
      }

      // 3. في الرئيسية ← ضغطتان للخروج
      if (isHome) {
        const now = Date.now();
        if (now - lastPressRef.current < 2000) {
          CapacitorApp.exitApp();
        } else {
          lastPressRef.current = now;
          setToast(s.lang === 'ar' ? 'اضغط مرة أخرى للخروج' : 'Press again to exit');
          window.setTimeout(() => setToast(null), 2000);
        }
      }
    }).then((h) => {
      if (cancelled) h.remove();
      else handle = h;
    });

    return () => {
      cancelled = true;
      handle?.remove();
    };
  }, []);

  return toast;
}

/* ----------------------------------------------------- Keyboard watcher */

function useKeyboardWatcher() {
  useEffect(() => {
    const vv = window.visualViewport;
    const isEditable = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        (el as HTMLElement).isContentEditable
      );
    };

    const update = () => {
      const vvReduced = vv ? window.innerHeight - vv.height > 150 : false;
      const focusedInput = isEditable(document.activeElement);
      document.documentElement.classList.toggle('keyboard-open', vvReduced || focusedInput);
    };

    let t1 = 0;
    let t2 = 0;
    const onFocusIn = () => update();
    const onFocusOut = () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      t1 = window.setTimeout(update, 80);
      t2 = window.setTimeout(update, 300);
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.documentElement.classList.remove('keyboard-open');
    };
  }, []);
}

/* ----------------------------------------------------- Router outlet */

function Outlet() {
  const { route } = useNav();
  const ref = useRef<HTMLDivElement>(null);
  const scrollMapRef = useRef<Record<string, number>>({});
  const prevKeyRef = useRef<string>('');
  const currentKey = JSON.stringify(route);

  // حفظ موضع التمرير عند كل تمرير
  useEffect(() => {
    const onScroll = () => {
      const k = prevKeyRef.current;
      if (k) scrollMapRef.current[k] = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // استعادة موضع التمرير عند تغيير المسار
  useLayoutEffect(() => {
    const target = scrollMapRef.current[currentKey] ?? 0;
    prevKeyRef.current = currentKey;

    let r1 = 0;
    let r2 = 0;
    r1 = requestAnimationFrame(() => {
      window.scrollTo(0, target);
      r2 = requestAnimationFrame(() => window.scrollTo(0, target));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [currentKey]);

  // تأثير fade-in
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('jw-fade-in');
    void el.offsetWidth;
    el.classList.add('jw-fade-in');
  }, [currentKey]);

  const isHome = route.name === 'home';

  const screen = (() => {
    switch (route.name) {
      case 'home': return <HomeScreen />;
      case 'services': return <ServicesScreen />;
      case 'service': return <ServiceDetailScreen id={route.id} />;
      case 'requests': return <RequestsScreen />;
      case 'request': return <RequestDetailScreen id={route.id} />;
      case 'flow': return <RequestFlowScreen kind={route.kind} serviceId={route.serviceId} />;
      case 'success': return <SuccessScreen id={route.id} />;
      case 'projects': return <ProjectsScreen />;
      case 'project': return <ProjectDetailScreen id={route.id} />;
      case 'more': return <MoreScreen />;
      case 'about': return <AboutScreen />;
      case 'contact': return <ContactScreen />;
      case 'settings': return <SettingsScreen />;
      case 'privacy': return <LegalScreen kind="privacy" />;
      case 'terms': return <LegalScreen kind="terms" />;
      case 'faq': return <FaqScreen />;
      case 'developer': return <DeveloperScreen />;
      case 'notifications': return <NotificationsScreen />;
      default: return <HomeScreen />;
    }
  })();

  return (
    <main
      ref={ref}
      className={cn(
        'min-h-[100svh]',
        !isHome && 'pt-[env(safe-area-inset-top)]',
        isMainTabRoute(route.name) ? 'pb-28' : 'pb-8',
      )}
    >
      {screen}
    </main>
  );
}

function Shell() {
  const backToast = useAndroidBackButton();
  useKeyboardWatcher();
  const { isOpen, closeDrawer } = useDrawer();

  useEffect(() => {
    const safeClear = async () => {
      try { await clearSystemNotifications(); } catch (e) {}
    };

    try {
      let deviceId = localStorage.getItem('aljawad.deviceId');
      if (!deviceId) {
        deviceId = `device-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('aljawad.deviceId', deviceId);
      }
      // ✅ الحماية: إذا فشلت الإشعارات، لن ينهار التطبيق
      setupPushNotifications(deviceId, () => {}).catch((err) => {
        console.error('Notification Setup Failed:', err);
      });
    } catch (error) {
      console.error('Sync Setup Error:', error);
    }

    safeClear();
  }, []);
  
  return (
    <div className="mx-auto min-h-[100svh] w-full max-w-[520px] bg-[color:var(--bg)] text-[color:var(--text)] shadow-[0_0_120px_rgba(0,0,0,0.45)]">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-20 mx-auto w-full max-w-[520px] bg-[color:var(--bg)]" style={{ height: 'env(safe-area-inset-top)' }} />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[520px] bg-[color:var(--bg)]/75 backdrop-blur-xl" style={{ height: 'max(env(safe-area-inset-bottom), 0.75rem)' }} />
      <Outlet />
      <BottomNav />
      {backToast && <Toast message={backToast} />}
      <SideDrawer open={isOpen} onClose={closeDrawer} />
    </div>
  );
}

function Root() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem(ONBOARDING_KEY); } catch { return false; }
  });
  const complete = () => {
    try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch {}
    setShowOnboarding(false);
  };

  if (showOnboarding) return <OnboardingScreen onComplete={complete} />;

  return (
    <DrawerProvider>
      <NotificationProvider>
        <NavigationProvider>
          <Shell />
        </NavigationProvider>
      </NotificationProvider>
    </DrawerProvider>
  );
}
    
export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CompanyProvider>
          <RequestsProvider>
            <ProjectsProvider>
              <DrawerProvider>
                <Root />
              </DrawerProvider>
            </ProjectsProvider>
          </RequestsProvider>
        </CompanyProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

import { useEffect, useRef } from 'react';
import { I18nProvider, useI18n } from './core/i18n';
import { ThemeProvider } from './core/theme';
import { NavigationProvider, useNav, type TabKey } from './core/navigation';
import { RequestsProvider } from './core/store';
import { Glyph, type GlyphName } from './components/icons';
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
  LegalScreen,
  MoreScreen,
  SettingsScreen,
} from './features/more/MoreScreens';
import { cn } from './utils/cn';

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
  const { t, dir } = useI18n();

  if (!isMainTabRoute(route.name)) return null;

  const index = TABS.findIndex((item) => item.key === tab);

  return (
    <nav
      aria-label={t('nav.home')}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <div className="pointer-events-auto relative mx-auto max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line-strong)] bg-[color:var(--elevated)]/92 backdrop-blur-2xl shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]">
        {/* active indicator */}
        <span
          className="absolute top-0 h-[2px] bg-[color:var(--primary)] transition-[inset-inline-start] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{
            width: `${100 / TABS.length}%`,
            insetInlineStart: `${(index < 0 ? 0 : index) * (100 / TABS.length)}%`,
          }}
        />
        <span
          className="pointer-events-none absolute -top-6 h-20 w-24 opacity-70 blur-2xl transition-[inset-inline-start] duration-500"
          style={{
            background: 'radial-gradient(circle, var(--glow), transparent 70%)',
            insetInlineStart: `calc(${(index < 0 ? 0 : index) * (100 / TABS.length)}% + ${
              dir === 'rtl' ? '0%' : '0%'
            })`,
          }}
        />
        <ul className="relative grid grid-cols-5">
          {TABS.map((item) => {
            const active = item.key === tab;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => goTab(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className="flex w-full flex-col items-center gap-1.5 px-1 py-3.5 transition-colors"
                >
                  <span
                    className={cn(
                      'relative grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] transition-all duration-400',
                      active
                        ? 'bg-gradient-to-br from-[color:var(--primary)]/25 to-[color:var(--navy)]/40 text-[color:var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                        : 'text-[color:var(--faint)]',
                    )}
                  >
                    <Glyph name={item.icon} size={20} strokeWidth={active ? 1.8 : 1.5} />
                  </span>
                  <span
                    className={cn(
                      'text-[0.62rem] font-semibold tracking-tight transition-colors',
                      active ? 'text-[color:var(--text)]' : 'text-[color:var(--faint)]',
                    )}
                  >
                    {t(item.labelKey)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/* ----------------------------------------------------- Router outlet */

function Outlet() {
  const { route } = useNav();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('jw-rise');
    void el.offsetWidth;
    el.classList.add('jw-rise');
  }, [route]);

  const key = JSON.stringify(route);
  const isHome = route.name === 'home';

  const screen = (() => {
    switch (route.name) {
      case 'home':
        return <HomeScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'service':
        return <ServiceDetailScreen id={route.id} />;
      case 'requests':
        return <RequestsScreen />;
      case 'request':
        return <RequestDetailScreen id={route.id} />;
      case 'flow':
        return <RequestFlowScreen kind={route.kind} serviceId={route.serviceId} />;
      case 'success':
        return <SuccessScreen id={route.id} />;
      case 'projects':
        return <ProjectsScreen />;
      case 'project':
        return <ProjectDetailScreen id={route.id} />;
      case 'more':
        return <MoreScreen />;
      case 'about':
        return <AboutScreen />;
      case 'contact':
        return <ContactScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'privacy':
        return <LegalScreen kind="privacy" />;
      case 'terms':
        return <LegalScreen kind="terms" />;
      case 'developer':
        return <DeveloperScreen />;
      default:
        return <HomeScreen />;
    }
  })();

  return (
    <main
     ref={ref}
     key={key}
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
  return (
    <div className="mx-auto min-h-[100svh] w-full max-w-[520px] bg-[color:var(--bg)] text-[color:var(--text)] shadow-[0_0_120px_rgba(0,0,0,0.45)]">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <RequestsProvider>
          <NavigationProvider>
            <Shell />
          </NavigationProvider>
        </RequestsProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

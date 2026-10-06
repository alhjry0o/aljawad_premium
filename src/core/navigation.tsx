import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ServiceIconKey } from '../data/services';
import type { RequestKind } from '../data/requests';

export type TabKey = 'home' | 'services' | 'requests' | 'projects' | 'more';

export type Route =
  | { name: 'home' }
  | { name: 'services' }
  | { name: 'service'; id: ServiceIconKey }
  | { name: 'requests' }
  | { name: 'request'; id: string }
  | { name: 'projects' }
  | { name: 'project'; id: string }
  | { name: 'more' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'settings' }
  | { name: 'privacy' }
  | { name: 'terms' }
  | { name: 'developer' }
  | { name: 'flow'; kind: RequestKind; serviceId?: ServiceIconKey }
  | { name: 'success'; id: string };

const TAB_OF: Record<Route['name'], TabKey> = {
  home: 'home',
  services: 'services',
  service: 'services',
  requests: 'requests',
  request: 'requests',
  projects: 'projects',
  project: 'projects',
  more: 'more',
  about: 'more',
  contact: 'more',
  settings: 'more',
  privacy: 'more',
  terms: 'more',
  developer: 'more',
  flow: 'requests',
  success: 'requests',
};

interface NavValue {
  route: Route;
  tab: TabKey;
  push: (route: Route) => void;
  replace: (route: Route) => void;
  back: () => void;
  canGoBack: boolean;
  goTab: (tab: TabKey) => void;
}

const NavContext = createContext<NavValue | null>(null);

const TAB_ROUTE: Record<TabKey, Route> = {
  home: { name: 'home' },
  services: { name: 'services' },
  requests: { name: 'requests' },
  projects: { name: 'projects' },
  more: { name: 'more' },
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }]);
  const route = stack[stack.length - 1];

  const push = useCallback((next: Route) => {
    setStack((s) => [...s, next]);
    window.scrollTo({ top: 0 });
  }, []);

  const replace = useCallback((next: Route) => {
    setStack((s) => [...s.slice(0, -1), next]);
    window.scrollTo({ top: 0 });
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const goTab = useCallback((tab: TabKey) => {
    setStack([TAB_ROUTE[tab]]);
    window.scrollTo({ top: 0 });
  }, []);

  const value = useMemo<NavValue>(
    () => ({
      route,
      tab: TAB_OF[route.name],
      push,
      replace,
      back,
      canGoBack: stack.length > 1,
      goTab,
    }),
    [route, stack.length, push, replace, back, goTab],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavigationProvider');
  return ctx;
}

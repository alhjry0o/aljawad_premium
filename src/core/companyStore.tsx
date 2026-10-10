import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { appConfig, type AppConfiguration } from '../data/company';

const REMOTE_URL =
  'https://raw.githubusercontent.com/alhjrY0o/aljawad_premium/main/public/data/company.json';

const CACHE_KEY = 'aljawad.company.v1';

interface CompanyValue {
  config: AppConfiguration;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CompanyContext = createContext<CompanyValue | null>(null);

function readCache(): AppConfiguration | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { config?: AppConfiguration };
    if (parsed.config && typeof parsed.config === 'object') {
      return parsed.config;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeCache(config: AppConfiguration) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ config, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfiguration>(() => readCache() ?? appConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${REMOTE_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { config?: AppConfiguration };
      if (data.config && typeof data.config === 'object') {
        setConfig(data.config);
        writeCache(data.config);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<CompanyValue>(
    () => ({ config, loading, error, refresh }),
    [config, loading, error, refresh],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used within CompanyProvider');
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { projects as staticProjects, type Project } from '../data/projects';

/**
 * عنوان ملف JSON البعيد.
 * عدّله إذا غيّرت المستودع أو الفرع.
 */
const REMOTE_URL =
  'https://raw.githubusercontent.com/alhjrY0o/aljawad_premium/main/public/data/projects.json';

const CACHE_KEY = 'aljawad.projects.v1';

interface ProjectsValue {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsValue | null>(null);

function readCache(): Project[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { projects?: Project[] };
    if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
      return parsed.projects;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeCache(projects: Project[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ projects, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => readCache() ?? staticProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${REMOTE_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { projects?: Project[] };
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects);
        writeCache(data.projects);
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

  const value = useMemo<ProjectsValue>(
    () => ({ projects, loading, error, refresh }),
    [projects, loading, error, refresh],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}

export function useProject(id: string): Project | undefined {
  const { projects } = useProjects();
  return projects.find((p) => p.id === id);
}

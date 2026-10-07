import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeValue {
  mode: ThemeMode;
  theme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);
const MODE_KEY = 'aljawad.theme';
const MOTION_KEY = 'aljawad.motion';

const systemTheme = (): ResolvedTheme =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

// ألوان شريط الحالة (تطابق متغيرات --bg في index.css)
const STATUS_BAR_COLORS = {
  dark: '#030605',
  light: '#c8dcd6',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(MODE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
  });
  const [reducedMotion, setReduced] = useState<boolean>(() => localStorage.getItem(MOTION_KEY) === '1');
  const [sys, setSys] = useState<ResolvedTheme>(systemTheme);

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: light)');
    const handler = () => setSys(mq.matches ? 'light' : 'dark');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const theme: ResolvedTheme = mode === 'system' ? sys : mode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(MODE_KEY, mode);

    // تحديث شريط الحالة وأزرار التنقل في تطبيق أندرويد
    if (Capacitor.isNativePlatform()) {
      const isDark = theme === 'dark';
      const bgColor = isDark ? STATUS_BAR_COLORS.dark : STATUS_BAR_COLORS.light;

      StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(() => {});

      // setBackgroundColor مدعوم على Android 14 وما دون
      // على Android 15+ الشريط شفاف تلقائيًا، لكن نبقيه للتوافق
      StatusBar.setBackgroundColor({ color: bgColor }).catch(() => {});
    }
  }, [theme, mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', reducedMotion ? 'reduced' : 'full');
    localStorage.setItem(MOTION_KEY, reducedMotion ? '1' : '0');
  }, [reducedMotion]);

  const value = useMemo<ThemeValue>(
    () => ({ mode, theme, setMode: setModeState, reducedMotion, setReducedMotion: setReduced }),
    [mode, theme, reducedMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

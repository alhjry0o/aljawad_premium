import { useEffect, useMemo, useRef, useState } from 'react';
import { searchServices } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Reveal, ScreenHeader } from '../../components/kit';
import { uiEvents } from '../../core/uiEvents';
import { cn } from '../../utils/cn';

export function ServicesScreen() {
  const { t, bi, lang } = useI18n();
  const { push } = useNav();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => searchServices(query), [query]);
  const inputRef = useRef<HTMLInputElement>(null);

  // فتح الكيبورد تلقائيًا عند القدوم من زر البحث في الرئيسية
  useEffect(() => {
    if (!uiEvents.focusServicesSearch) return;
    uiEvents.focusServicesSearch = false;

    const t1 = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.click();
    }, 200);

    return () => window.clearTimeout(t1);
  }, []);

  return (
    <div className="pb-6">
      <ScreenHeader title={t('services.title')} subtitle={t('services.count')} />

      {/* ============ Modern Search Capsule ============ */}
      <div className="px-5 pt-5">
        <div
          className={cn(
            'flex items-center gap-3 rounded-full border bg-[color:var(--elevated)]/60 px-5 py-3.5 backdrop-blur-xl transition-all duration-300',
            focused
              ? 'border-[color:var(--primary)]/60 shadow-[0_0_0_4px_rgba(43,211,140,0.1),0_0_28px_-6px_var(--glow)]'
              : 'border-white/10',
          )}
        >
          <Glyph
            name="search"
            size={18}
            className={cn(
              'shrink-0 transition-colors',
              focused ? 'text-[color:var(--primary)]' : 'text-[color:var(--faint)]',
            )}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t('hero.search')}
            aria-label={t('hero.search')}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-[color:var(--faint)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('search.clear')}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 text-[color:var(--faint)] transition-colors hover:text-white"
            >
              <Glyph name="close" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ============ Results ============ */}
      {results.length === 0 ? (
        <div className="px-5 py-24 text-center">
          <MaterialIcon3D name="search" accent="navy" size={88} className="mx-auto opacity-80" />
          <p className="mt-5 text-[1rem] font-bold">{t('search.empty')}</p>
          <p className="mt-1 text-[0.8rem] text-[color:var(--muted)]">{t('search.emptyHint')}</p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3.5 px-5">
          {results.map((s, i) => (
            <Reveal as="li" key={s.id} delay={Math.min(i * 45, 300)}>
              <button
                type="button"
                onClick={() => push({ name: 'service', id: s.id })}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] p-4 text-start shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-2xl transition-all duration-300 active:scale-[0.97]"
              >
                {/* soft glow on hover */}
                <div
                  className="pointer-events-none absolute -top-16 -end-16 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle, var(--glow), transparent 70%)',
                  }}
                />

                <div className="relative">
                  {/* order number */}
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[0.6rem] font-bold tracking-[0.28em] text-[#5fe0a5]"
                      style={{ textShadow: '0 0 10px rgba(43, 211, 140, 0.5)' }}
                    >
                      {s.number}
                    </span>
                    <span className="h-px w-6 bg-gradient-to-l from-[#2bd38c]/40 to-transparent" />
                  </div>

                  {/* icon */}
                  <div className="mx-auto mt-2 grid place-items-center">
                    <MaterialIcon3D name={s.id} accent={s.accent} size={62} />
                  </div>

                  {/* title */}
                  <h3 className="mt-3 text-[0.9rem] font-extrabold leading-tight tracking-tight text-white">
                    {bi(s.title)}
                  </h3>

                  {/* description */}
                  <p className="mt-1.5 line-clamp-2 text-[0.7rem] leading-relaxed text-white/55">
                    {bi(s.statement)}
                  </p>
                </div>

                {/* footer arrow */}
                <div className="relative mt-3 flex items-center gap-1 text-[0.66rem] font-semibold text-[color:var(--primary)]">
                  {t('services.open')}
                  <Glyph
                    name="arrow"
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { searchServices } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Reveal, ScreenHeader } from '../../components/kit';

export function ServicesScreen() {
  const { t, bi, lang } = useI18n();
  const { push } = useNav();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchServices(query), [query]);

  return (
    <div className="pb-6">
      <ScreenHeader title={t('services.title')} subtitle={t('services.count')} />

      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[color:var(--line)] bg-[color:var(--elevated)] px-4 py-3.5">
          <Glyph name="search" size={18} className="text-[color:var(--faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('hero.search')}
            aria-label={t('hero.search')}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-[color:var(--faint)]"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label={t('search.clear')}>
              <Glyph name="close" size={16} className="text-[color:var(--faint)]" />
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="px-5 py-24 text-center">
          <MaterialIcon3D name="search" accent="navy" size={88} className="mx-auto opacity-80" />
          <p className="mt-5 text-[1rem] font-bold">{t('search.empty')}</p>
          <p className="mt-1 text-[0.8rem] text-[color:var(--muted)]">{t('search.emptyHint')}</p>
        </div>
      ) : (
        <ul className="mt-6">
          {results.map((s, i) => (
            <Reveal as="li" key={s.id} delay={Math.min(i * 50, 300)}>
              <button
                type="button"
                onClick={() => push({ name: 'service', id: s.id })}
                className="group flex w-full items-center gap-4 border-t border-[color:var(--line)] px-5 py-5 text-start transition-colors hover:bg-[color:var(--surface)]"
              >
                <MaterialIcon3D name={s.id} accent={s.accent} size={64} />
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-[0.65rem] tracking-[0.25em] text-[color:var(--primary)]">
                    {s.number}
                  </span>
                  <span className="mt-1 block text-[1.02rem] font-bold leading-snug tracking-tight">
                    {bi(s.title)}
                  </span>
                  <span className="mt-1 block text-[0.78rem] leading-relaxed text-[color:var(--muted)]">
                    {bi(s.statement)}
                  </span>
                </span>
                <Glyph
                  name="arrow"
                  size={18}
                  className="shrink-0 text-[color:var(--faint)] transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                />
              </button>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}

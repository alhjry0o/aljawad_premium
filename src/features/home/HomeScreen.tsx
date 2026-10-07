import { useMemo, useState } from 'react';
import { appAssets, appConfig } from '../../data/company';
import { searchServices, services } from '../../data/services';
import { projects } from '../../data/projects';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { externalActions } from '../../core/actions';
import { BrandMark, Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, DemoBadge, Reveal, SectionHead, useScrollY } from '../../components/kit';
import { ServiceCarousel } from '../services/ServiceCarousel';
import { cn } from '../../utils/cn';

function HeroSearch() {
  const { t, bi, lang } = useI18n();
  const { push } = useNav();
  const [query, setQuery] = useState('');
  const results = useMemo(() => (query.trim() ? searchServices(query).slice(0, 5) : []), [query]);
  const open = query.trim().length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center gap-3 rounded-[var(--radius-sm)] border border-white/15 bg-black/45 px-4 py-3.5 backdrop-blur-xl transition-colors',
          open && 'border-[#2bd38c]/60',
        )}
      >
        <Glyph name="search" size={18} className="shrink-0 text-white/60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('hero.search')}
          aria-label={t('hero.search')}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className="w-full bg-transparent text-[0.92rem] text-white placeholder:text-white/45 outline-none"
        />
        {open && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={t('search.clear')}
            className="shrink-0 text-white/50 hover:text-white"
          >
            <Glyph name="close" size={16} />
          </button>
        )}
      </div>

      {open && (
        <div className="jw-rise absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-[var(--radius-md)] border border-white/12 bg-[#060b0a]/95 backdrop-blur-2xl">
          {results.length === 0 ? (
            <div className="px-5 py-7 text-center">
              <p className="text-[0.9rem] font-semibold text-white">{t('search.empty')}</p>
              <p className="mt-1 text-[0.75rem] text-white/50">{t('search.emptyHint')}</p>
            </div>
          ) : (
            <ul>
              {results.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      push({ name: 'service', id: s.id });
                    }}
                    className="flex w-full items-center gap-3 border-b border-white/6 px-4 py-3 text-start transition-colors last:border-0 hover:bg-white/5"
                  >
                    <MaterialIcon3D name={s.id} accent={s.accent} size={38} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.88rem] font-semibold text-white">
                        {bi(s.title)}
                      </span>
                      <span className="block truncate text-[0.72rem] text-white/50">{bi(s.statement)}</span>
                    </span>
                    <span className="font-mono text-[0.65rem] text-white/35">{s.number}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Hero() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { reducedMotion } = useTheme();
  const y = useScrollY();
  const p = reducedMotion ? 0 : Math.min(y, 520);

  return (
    <section className="relative min-h-[94svh] overflow-hidden bg-[#030605]">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${p * 0.25}px, 0) scale(${1 + p * 0.0004})` }}
      >
        <img
          src={appAssets.hero}
          alt=""
          className="h-full w-full object-cover opacity-70"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#030605]/75 via-[#030605]/55 to-[#030605]" />
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(85% 55% at 15% 12%, rgba(31,163,106,0.3), transparent 60%)' }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(70% 50% at 100% 30%, rgba(23,60,130,0.45), transparent 65%)' }}
      />
      <div className="jw-grid absolute inset-0 opacity-[0.07]" />

      <div
        className="relative flex min-h-[94svh] flex-col px-5 pb-10 pt-[calc(env(safe-area-inset-top)+1.5rem)]"
        style={{ opacity: reducedMotion ? 1 : Math.max(0.25, 1 - p / 620) }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark size={34} />
            <div className="leading-tight">
              <div className="text-[0.95rem] font-extrabold tracking-tight text-white">
                {bi(appConfig.appName)}
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-white/45">ALJAWAD</div>
            </div>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
            {t('common.offline')}
          </span>
        </div>

        <div className="mt-auto pt-16">
          <div className="jw-rise mb-5 flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.28em] text-[#5fe0a5]">
            <span className="h-px w-8 bg-[#5fe0a5]/50" />
            {t('hero.eyebrow')}
          </div>
          <h1 className="max-w-[18ch] text-[clamp(2.3rem,10vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            <span className="jw-rise block" style={{ animationDelay: '60ms' }}>
              {t('hero.title.1')}
            </span>
            <span
              className="jw-rise block bg-gradient-to-l from-[#2bd38c] via-[#5fe0a5] to-[#7fc5ff] bg-clip-text text-transparent"
              style={{ animationDelay: '160ms' }}
            >
              {t('hero.title.2')}
            </span>
            <span className="jw-rise block" style={{ animationDelay: '260ms' }}>
              {t('hero.title.3')}
            </span>
          </h1>
          <p
            className="jw-rise mt-5 max-w-[42ch] text-[0.92rem] leading-relaxed text-white/60"
            style={{ animationDelay: '340ms' }}
          >
            {t('hero.support')}
          </p>
        </div>

        <div className="jw-rise mt-10 space-y-4" style={{ animationDelay: '420ms' }}>
          <HeroSearch />
          <div className="flex items-center gap-3">
            <Button onClick={() => push({ name: 'flow', kind: 'service' })} icon="arrow">
              {t('hero.cta.primary')}
            </Button>
            <button
              type="button"
              onClick={() => push({ name: 'flow', kind: 'quote' })}
              className="group inline-flex items-center gap-2 px-1 py-3 text-[0.9rem] font-semibold text-white/75 transition-colors hover:text-white"
            >
              <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-[#2bd38c]">
                {t('hero.cta.secondary')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickActions() {
  const { t } = useI18n();
  const { push } = useNav();
  const items = [
    { icon: 'receipt' as const, label: t('quick.request'), run: () => push({ name: 'flow', kind: 'service' }) },
    { icon: 'quote' as const, label: t('quick.quote'), run: () => push({ name: 'flow', kind: 'quote' }) },
    { icon: 'inspect' as const, label: t('quick.inspection'), run: () => push({ name: 'flow', kind: 'inspection' }) },
    { icon: 'whatsapp' as const, label: t('quick.whatsapp'), run: () => externalActions.whatsapp(appConfig.contact.whatsapp) },
  ];
  return (
    <div className="relative z-10 -mt-10 px-5 pb-2">
      <div className="grid grid-cols-4 gap-2 rounded-[var(--radius-md)] border border-[color:var(--line)] bg-[color:var(--elevated)] p-2 shadow-[0_24px_60px_-34px_rgba(0,0,0,0.9)]">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.run}
            className="flex flex-col items-center gap-2 rounded-[var(--radius-sm)] px-1 py-3 transition-colors hover:bg-[color:var(--surface)]"
          >
            <Glyph name={item.icon} size={21} className="text-[color:var(--primary)]" />
            <span className="text-[0.68rem] font-semibold text-[color:var(--muted)]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BrandStatement() {
  const { t } = useI18n();
  return (
    <Reveal className="px-5 py-20">
      <div className="relative">
        <span className="absolute -top-6 start-0 text-[5rem] leading-none text-[color:var(--primary)]/15">“</span>
        <p className="relative text-[1.3rem] font-semibold leading-[1.7] tracking-tight text-[color:var(--text)]">
          {t('brand.statement')}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <BrandMark size={26} />
          <span className="text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
            {t('brand.statement.kicker')}
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function WhyAljawad() {
  const { t, lang } = useI18n();
  const points = [
    { n: '01', title: t('why.1.title'), body: t('why.1.body'), icon: 'manpower' as const },
    { n: '02', title: t('why.2.title'), body: t('why.2.body'), icon: 'layers' as const },
    { n: '03', title: t('why.3.title'), body: t('why.3.body'), icon: 'equipment' as const },
    { n: '04', title: t('why.4.title'), body: t('why.4.body'), icon: 'construction' as const },
  ];
  return (
    <section className="relative overflow-hidden border-y border-[color:var(--line)] bg-[color:var(--surface)] py-16">
      <div className="jw-grid absolute inset-0 opacity-30" />
      <div className="relative">
        <Reveal className="px-5">
          <h2 className="text-[2rem] font-extrabold leading-tight tracking-tight">{t('why.title')}</h2>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="bg-gradient-to-b from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-[3.4rem] font-black leading-none tracking-tighter text-transparent">
              {appConfig.projectsCount.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}+
            </span>
            <span className="text-[0.85rem] font-medium text-[color:var(--muted)]">{t('why.counter')}</span>
          </div>
        </Reveal>

        <ul className="mt-10">
          {points.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 80}>
              <div className="flex items-start gap-4 border-t border-[color:var(--line)] px-5 py-6">
                <span className="font-mono text-[0.7rem] text-[color:var(--primary)]">{p.n}</span>
                <div className="flex-1">
                  <h3 className="text-[1.02rem] font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-[0.82rem] leading-relaxed text-[color:var(--muted)]">{p.body}</p>
                </div>
                <Glyph name={p.icon} size={22} className="mt-1 text-[color:var(--faint)]" />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const featured = projects.filter((p) => p.featured);
  const [lead, ...rest] = featured;

  return (
    <section className="py-16">
      <SectionHead
        kicker={t('projects.title')}
        title={t('projects.featured')}
        action={t('projects.all')}
        onAction={() => push({ name: 'projects' })}
      />
      <Reveal className="px-5">
        <button
          type="button"
          onClick={() => push({ name: 'project', id: lead.id })}
          className="group relative block h-[26rem] w-full overflow-hidden rounded-[var(--radius-lg)] text-start"
        >
          <img
            src={lead.cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <DemoBadge label={lead.code} />
            <h3 className="mt-3 text-[1.5rem] font-bold leading-snug tracking-tight text-white">
              {bi(lead.title)}
            </h3>
            <div className="mt-3 flex items-center gap-2 text-[0.78rem] font-semibold text-[#5fe0a5]">
              {t('services.open')}
              <Glyph name="arrow" size={15} className="rtl:-scale-x-100" />
            </div>
          </div>
        </button>
      </Reveal>

      <div className="mt-4 grid grid-cols-2 gap-4 px-5">
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <button
              type="button"
              onClick={() => push({ name: 'project', id: p.id })}
              className="group relative block h-[13rem] w-full overflow-hidden rounded-[var(--radius-md)] text-start"
            >
              <img
                src={p.cover}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/50">{p.code}</span>
                <h4 className="mt-1 text-[0.88rem] font-bold leading-snug text-white">{bi(p.title)}</h4>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 px-5 text-[0.7rem] text-[color:var(--faint)]">{t('projects.demoNote')}</p>
    </section>
  );
}

function ServiceHighlight() {
  const { bi, t } = useI18n();
  const { push } = useNav();
  const highlight = services[1];
  return (
    <Reveal className="relative overflow-hidden">
      <div className="relative h-[30rem]">
        <img src={highlight.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/55 to-[#030605]/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <MaterialIcon3D name={highlight.id} accent={highlight.accent} size={76} />
          <span className="mt-4 font-mono text-[0.7rem] tracking-[0.3em] text-white/50">
            {highlight.number}
          </span>
          <h3 className="mt-2 text-[1.75rem] font-extrabold leading-tight tracking-tight text-white">
            {bi(highlight.title)}
          </h3>
          <p className="mt-2 max-w-[38ch] text-[0.85rem] leading-relaxed text-white/65">
            {bi(highlight.statement)}
          </p>
          <div className="mt-5">
            <Button variant="secondary" onClick={() => push({ name: 'service', id: highlight.id })} icon="arrow">
              {t('services.open')}
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ClosingCTA() {
  const { t } = useI18n();
  const { push } = useNav();
  return (
    <Reveal className="px-5 py-16">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line)] bg-[color:var(--surface)] p-7">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: 'radial-gradient(90% 70% at 10% 0%, var(--glow), transparent 65%)' }}
        />
        <div className="relative">
          <h3 className="text-[1.5rem] font-extrabold leading-tight tracking-tight">{t('cta.title')}</h3>
          <p className="mt-2 max-w-[40ch] text-[0.85rem] leading-relaxed text-[color:var(--muted)]">
            {t('cta.body')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => push({ name: 'flow', kind: 'service' })}>{t('hero.cta.primary')}</Button>
            <Button variant="ghost" onClick={() => push({ name: 'flow', kind: 'quote' })}>
              {t('hero.cta.secondary')}
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function BrandFooter() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const c = appConfig.contact;
  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:var(--bgdeep)] px-5 pb-10 pt-12">
      <div className="flex items-center gap-3">
        <BrandMark size={32} />
        <div>
          <div className="text-[0.95rem] font-bold tracking-tight">{bi(appConfig.companyName)}</div>
          <div className="text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--faint)]">
            {c.website}
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-1.5 text-[0.8rem] text-[color:var(--muted)]">
        <p>{bi(c.address)}</p>
        <p dir="ltr" className="text-start">
          {c.phone} · {c.mobile1} · {c.mobile2}
        </p>
        <p dir="ltr" className="text-start">
          {c.email}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => externalActions.call(c.phone)} icon="phone">
          {t('quick.call')}
        </Button>
        <Button variant="ghost" onClick={() => externalActions.whatsapp(c.whatsapp)} icon="whatsapp">
          {t('quick.whatsapp')}
        </Button>
        <Button variant="ghost" onClick={() => push({ name: 'contact' })}>
          {t('contact.title')}
        </Button>
      </div>
      <p className="mt-8 text-[0.68rem] text-[color:var(--faint)]">
        {t('dev.credit')} — {bi(appConfig.developer.name)}
      </p>
    </footer>
  );
}

export function HomeScreen() {
  const { t } = useI18n();
  const { push } = useNav();
  return (
    <div>
      <Hero />
      <QuickActions />
      <section className="pt-16">
        <SectionHead
          kicker={t('services.kicker')}
          title={t('services.title')}
          action={t('services.all')}
          onAction={() => push({ name: 'services' })}
        />
        <ServiceCarousel />
      </section>
      <BrandStatement />
      <WhyAljawad />
      <FeaturedProjects />
      <ServiceHighlight />
      <ClosingCTA />
      <BrandFooter />
    </div>
  );
}

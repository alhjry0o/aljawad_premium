import { useEffect, useRef, useState } from 'react';
import { appAssets } from '../../data/company';
import { services } from '../../data/services';
import { useCompany } from '../../core/companyStore';
import { useProjects } from '../../core/projectsStore';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { externalActions } from '../../core/actions';
import { BrandMark, Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, Counter, DemoBadge, Reveal, SectionHead, useScrollY } from '../../components/kit';
import { ServiceCarousel } from '../services/ServiceCarousel';
import { uiEvents } from '../../core/uiEvents';

function HeroSearchButton() {
  const { t } = useI18n();
  const { push } = useNav();

  const onClick = () => {
    uiEvents.focusServicesSearch = true;
    push({ name: 'services' });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-white/15 bg-black/45 px-4 py-3.5 text-start backdrop-blur-xl transition-colors active:border-[#2bd38c]/60"
    >
      <Glyph name="search" size={18} className="shrink-0 text-white/60" />
      <span className="flex-1 text-[0.92rem] text-white/45">{t('hero.search')}</span>
    </button>
  );
}

function Hero() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { config: appConfig } = useCompany();
  const { reducedMotion } = useTheme();
  const y = useScrollY();
  const p = reducedMotion ? 0 : Math.min(y, 520);

  return (
    <section className="relative min-h-[94svh] bg-[#030605]">
     <div className="absolute inset-0 overflow-hidden">
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

      <div className="relative flex min-h-[94svh] flex-col px-5 pb-32 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <div
          className="flex items-center justify-between"
          style={{ opacity: reducedMotion ? 1 : Math.max(0, 1 - p / 480) }}
        >
          <div className="flex items-center gap-2.5">
            <BrandMark size={34} />
            <div className="leading-tight">
              <div className="text-[0.95rem] font-extrabold tracking-tight text-white">
                {bi(appConfig.appName)}
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-white/45">ALJAWAD</div>
            </div>
          </div>
        </div>

        <div
          className="mt-auto pt-16"
          style={{ opacity: reducedMotion ? 1 : Math.max(0, 1 - p / 480) }}
        >
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
          <HeroSearchButton />
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
  const { config: appConfig } = useCompany();
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
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();

  const statsLabels = {
    kicker: { ar: 'نظرة على أرقامنا', en: 'By the numbers' },
    title: { ar: 'مسيرتنا بالأرقام', en: 'Our journey in numbers' },
    projectsLabel: { ar: 'مشروع منفذ بنجاح', en: 'Projects delivered' },
  };

  const miniStats = [
    {
      icon: 'construction' as const,
      color: '#2bd38c',
      value: appConfig.constructionCount,
      label: { ar: 'بناء وتشييد عقاري', en: 'Building & construction' },
    },
    {
      icon: 'facade' as const,
      color: '#7fc5ff',
      value: appConfig.facadeCount,
      label: { ar: 'تنظيف واجهات', en: 'Facade cleaning' },
    },
    {
      icon: 'mep' as const,
      color: '#5fe0a5',
      value: appConfig.mepCount,
      label: { ar: 'صيانة كهرباء وتكييف', en: 'MEP maintenance' },
    },
    {
      icon: 'spark' as const,
      color: '#f5c451',
      value: appConfig.experienceYears,
      label: { ar: 'عاماً من الخبرة', en: 'Years of expertise' },
    },
  ];

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
        {/* ================ Stats Showcase Card ================ */}
        <Reveal className="px-5">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line-strong)] bg-gradient-to-br from-[#0a1a2e] via-[#0a1f24] to-[#04140f] p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)]">
            {/* decorative */}
            <div className="jw-grid absolute inset-0 opacity-[0.07]" />
            <div
              className="pointer-events-none absolute -top-20 -end-20 h-48 w-48 rounded-full opacity-35 blur-3xl"
              style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -start-20 h-48 w-48 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
            />

            <div className="relative">
              {/* header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[0.58rem] uppercase tracking-[0.28em] text-[#5fe0a5]">
                    {bi(statsLabels.kicker)}
                  </div>
                  <h3 className="mt-1 text-[1rem] font-extrabold tracking-tight text-white">
                    {bi(statsLabels.title)}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2bd38c] shadow-[0_0_8px_#2bd38c]" />
                  <span className="text-[0.58rem] font-semibold tracking-wider text-white/60">
                    LIVE
                  </span>
                </div>
              </div>

              {/* hero stat + sparkline */}
              <div className="mt-5 flex items-end justify-between gap-4">
                <div className="shrink-0">
                  <div
                    className="flex items-baseline gap-0.5"
                    style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                  >
                    <span className="bg-gradient-to-br from-[#2bd38c] via-[#5fe0a5] to-[#7fc5ff] bg-clip-text text-[2.4rem] font-black leading-none tracking-tighter text-transparent">
                      <Counter to={appConfig.projectsCount} locale="en-US" />
                    </span>
                    <span className="bg-gradient-to-br from-[#2bd38c] to-[#7fc5ff] bg-clip-text text-[1.6rem] font-black leading-none text-transparent">
                      +
                    </span>
                  </div>
                  <div className="mt-1.5 text-[0.68rem] font-medium text-white/50">
                    {bi(statsLabels.projectsLabel)}
                  </div>
                </div>

                <div className="h-12 flex-1 min-w-0">
                  <svg viewBox="0 0 200 48" className="h-full w-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="jw-spark-fill-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2bd38c" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#2bd38c" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="jw-spark-line-2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2bd38c" />
                        <stop offset="100%" stopColor="#7fc5ff" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,38 C30,36 55,34 85,24 C115,14 145,20 175,9 L200,4 L200,48 L0,48 Z"
                      fill="url(#jw-spark-fill-2)"
                    />
                    <path
                      d="M0,38 C30,36 55,34 85,24 C115,14 145,20 175,9 L200,4"
                      fill="none"
                      stroke="url(#jw-spark-line-2)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle cx="85" cy="24" r="2.4" fill="#0a1f24" stroke="#2bd38c" strokeWidth="1.6" />
                    <circle cx="175" cy="9" r="2.4" fill="#0a1f24" stroke="#7fc5ff" strokeWidth="1.6" />
                  </svg>
                </div>
              </div>

              {/* divider */}
              <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* 2x2 grid of detailed stats */}
              <div className="grid grid-cols-2 gap-2.5">
                {miniStats.map((s, i) => (
                  <div
                    key={i}
function WhyAljawad() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();

  const statsLabels = {
    kicker: { ar: 'نظرة على أرقامنا', en: 'By the numbers' },
    title: { ar: 'مسيرتنا بالأرقام', en: 'Our journey in numbers' },
    projectsLabel: { ar: 'مشروع منفذ بنجاح', en: 'Projects delivered' },
  };

  const miniStats = [
    {
      icon: 'facade' as const,
      color: '#2bd38c',
      value: appConfig.facadeCount,
      label: { ar: 'تنظيف واجهات', en: 'Facade cleaning' },
    },
    {
      icon: 'construction' as const,
      color: '#5fe0a5',
      value: appConfig.constructionCount,
      label: { ar: 'بناء وتشييد عقاري', en: 'Building & construction' },
    },
    {
      icon: 'spark' as const,
      color: '#7fc5ff',
      value: appConfig.experienceYears,
      label: { ar: 'عاماً من الخبرة', en: 'Years of expertise' },
    },
    {
      icon: 'mep' as const,
      color: '#a9c9ff',
      value: appConfig.mepCount,
      label: { ar: 'صيانة كهرباء وتكييف', en: 'MEP maintenance' },
    },
  ];

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
        {/* ============ Dashboard Card ============ */}
        <Reveal className="px-5">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            {/* soft color glows */}
            <div
              className="pointer-events-none absolute -top-32 -end-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-32 -start-24 h-64 w-64 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(circle, #0d1f3f, transparent 70%)' }}
            />

            <div className="relative">
              {/* Header — title + LIVE */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#5fe0a5]">
                    {bi(statsLabels.kicker)}
                  </div>
                  <h3 className="mt-1 text-[1.05rem] font-extrabold tracking-tight text-white">
                    {bi(statsLabels.title)}
                  </h3>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[#2bd38c]/30 bg-[#2bd38c]/10 px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#2bd38c] opacity-70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-[#2bd38c]" />
                  </span>
                  <span className="text-[0.58rem] font-bold tracking-[0.15em] text-[#5fe0a5]">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Hero number */}
              <div
                className="mt-6"
                style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
              >
                <div className="flex items-baseline gap-1">
                  <span className="bg-gradient-to-br from-[#2bd38c] via-[#5fe0a5] to-[#7fc5ff] bg-clip-text text-[3rem] font-black leading-none tracking-tighter text-transparent">
                    <Counter to={appConfig.projectsCount} locale="en-US" />
                  </span>
                  <span className="bg-gradient-to-br from-[#2bd38c] to-[#7fc5ff] bg-clip-text text-[1.8rem] font-black leading-none text-transparent">
                    +
                  </span>
                </div>
                <div className="mt-2 text-[0.72rem] font-medium text-white/55">
                  {bi(statsLabels.projectsLabel)}
                </div>
              </div>

              {/* Neon chart */}
              <div className="relative mt-4 h-24 w-full">
                <svg
                  viewBox="0 0 300 90"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="jw-chart-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2bd38c" stopOpacity="0.42" />
                      <stop offset="55%" stopColor="#2bd38c" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#2bd38c" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="jw-chart-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2bd38c" />
                      <stop offset="100%" stopColor="#7fc5ff" />
                    </linearGradient>
                    <filter
                      id="jw-chart-glow"
                      x="-30%"
                      y="-30%"
                      width="160%"
                      height="160%"
                    >
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* soft neon glow behind line */}
                  <path
                    d="M0,70 C40,66 70,66 110,48 C150,30 190,42 230,24 C260,12 285,14 300,10"
                    fill="none"
                    stroke="#2bd38c"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.18"
                    style={{ filter: 'blur(6px)' }}
                  />

                  {/* gradient area */}
                  <path
                    d="M0,70 C40,66 70,66 110,48 C150,30 190,42 230,24 C260,12 285,14 300,10 L300,90 L0,90 Z"
                    fill="url(#jw-chart-area)"
                  />

                  {/* neon line */}
                  <path
                    d="M0,70 C40,66 70,66 110,48 C150,30 190,42 230,24 C260,12 285,14 300,10"
                    fill="none"
                    stroke="url(#jw-chart-line)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    filter="url(#jw-chart-glow)"
                  />

                  {/* data points */}
                  <circle cx="110" cy="48" r="3" fill="#0a1f24" stroke="#2bd38c" strokeWidth="2" />
                  <circle cx="230" cy="24" r="3" fill="#0a1f24" stroke="#7fc5ff" strokeWidth="2" />
                </svg>
              </div>

              {/* divider */}
              <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />

              {/* 2x2 grid — clean, no hard dividers */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {miniStats.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className="grid h-4 w-4 place-items-center"
                        style={{ color: s.color, filter: `drop-shadow(0 0 6px ${s.color}90)` }}
                      >
                        <Glyph name={s.icon} size={16} strokeWidth={1.8} />
                      </span>
                      <span className="text-[0.62rem] font-medium leading-tight text-white/60">
                        {bi(s.label)}
                      </span>
                    </div>

                    <div
                      className="mt-2 flex items-baseline gap-0.5"
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                    >
                      <span
                        className="text-[1.5rem] font-black leading-none tracking-tight"
                        style={{ color: s.color, textShadow: `0 0 14px ${s.color}50` }}
                      >
                        <Counter to={s.value} locale="en-US" />
                      </span>
                      <span
                        className="text-[1.05rem] font-black leading-none"
                        style={{ color: s.color }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ============ Title ============ */}
        <Reveal className="mt-14 px-5">
          <h2 className="text-[2rem] font-extrabold leading-tight tracking-tight">
            {t('why.title')}
          </h2>
        </Reveal>

        {/* ============ Points ============ */}
        <ul className="mt-8">
          {points.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 80}>
              <div className="flex items-start gap-4 border-t border-[color:var(--line)] px-5 py-6">
                <span className="font-mono text-[0.7rem] text-[color:var(--primary)]">{p.n}</span>
                <div className="flex-1">
                  <h3 className="text-[1.02rem] font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-[0.82rem] leading-relaxed text-[color:var(--muted)]">
                    {p.body}
                  </p>
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
  const { projects } = useProjects();
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
  const { config: appConfig } = useCompany();
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

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
import { SideDrawer } from '../../components/SideDrawer';
import { uiEvents } from '../../core/uiEvents';
import { cn } from '../../utils/cn';
import { useDrawer } from '../../core/drawer';

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
      className="flex w-full items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.035] px-4 py-3.5 text-start backdrop-blur-xl transition-all duration-300 active:border-[#2bd38c]/60 active:bg-white/[0.06]"
    >
      <Glyph name="search" size={18} className="shrink-0 text-white/50" />
      <span className="flex-1 text-[0.92rem] text-white/45">{t('hero.search')}</span>
    </button>
  );
}

function Hero({ onMenuClick }: { onMenuClick: () => void }) {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { config: appConfig } = useCompany();
  const { reducedMotion } = useTheme();
  const y = useScrollY();
  const p = reducedMotion ? 0 : Math.min(y, 520);

  const quickItems = [
    { icon: 'receipt' as const, label: t('quick.request'), run: () => push({ name: 'flow', kind: 'service' }) },
    { icon: 'quote' as const, label: t('quick.quote'), run: () => push({ name: 'flow', kind: 'quote' }) },
    { icon: 'inspect' as const, label: t('quick.inspection'), run: () => push({ name: 'flow', kind: 'inspection' }) },
    { icon: 'whatsapp' as const, label: t('quick.whatsapp'), run: () => externalActions.whatsapp(appConfig.contact.whatsapp) },
  ];

  return (
    <section className="relative min-h-[94svh] bg-[#030605]">
      {/* Background Image & Overlays */}
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#030605]/80 via-[#030605]/50 to-[#030605]" />
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(85% 55% at 15% 12%, rgba(31,163,106,0.3), transparent 60%)' }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(70% 50% at 100% 30%, rgba(23,60,130,0.45), transparent 65%)' }}
      />
      <div className="jw-grid absolute inset-0 opacity-[0.07]" />

      {/* ✅ Unified Fixed Glassmorphic Header (Transparent for Hero) */}
      <header className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-[520px] px-5 pb-3.5 pt-[calc(env(safe-area-inset-top)+1rem)]">
         {/* نجبر الحاوية على LTR لضمان بقاء الزر في اليسار دائماً */}      
        <div className="flex items-center justify-between" dir="ltr">
          {/* الجهة اليسرى: زر القائمة */}      
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/20 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:bg-black/40 active:scale-95"
          >
            <Glyph name="menu" size={22} strokeWidth={2} />
       </button>
          {/* الجهة اليمنى: الشعار */}      
          <div className="relative flex items-center gap-3" dir="rtl">
            <div
              className="pointer-events-none absolute -inset-3 -z-10 rounded-full opacity-40 blur-2xl"
              style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
            />
            <BrandMark size={38} className="drop-shadow-[0_4px_12px_rgba(43,211,140,0.2)]" />
            <div className="leading-tight text-right">
              <div className="text-[1.05rem] font-extrabold tracking-tight text-white">
                {bi(appConfig.appName)}
              </div>
              <div className="text-[0.62rem] uppercase tracking-[0.25em] text-white/50">
                ALJAWAD
              </div>
            </div>
          </div>
        </div>
      </header>

          {/* Menu Button (Right in RTL) */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:bg-white/10 active:scale-95"
          >
            <Glyph name="menu" size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="relative flex min-h-[94svh] flex-col px-5 pb-10 pt-[calc(env(safe-area-inset-top)+6rem)]">
        
        {/* Hero Text Content */}
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

        {/* Unified Glass Panel: Search + CTA + Quick Actions */}
        <div className="jw-rise mt-10" style={{ animationDelay: '420ms' }}>
          <HeroSearchButton />

          <div className="relative mt-3 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl shadow-[0_20px_60px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            {/* Inner soft glow */}
            <div
              className="pointer-events-none absolute -top-24 start-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
            />

            <div className="relative">
              {/* CTA Row */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => push({ name: 'flow', kind: 'service' })}
                  icon="arrow"
                  className="flex-1 py-3.5"
                >
                  {t('hero.cta.primary')}
                </Button>
                <button
                  type="button"
                  onClick={() => push({ name: 'flow', kind: 'quote' })}
                  className="group flex flex-1 items-center justify-center px-1 py-3 text-[0.9rem] font-semibold text-white/75 transition-colors hover:text-white"
                >
                  <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-[#2bd38c]">
                    {t('hero.cta.secondary')}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-4 gap-1">
                {quickItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.run}
                    className="flex flex-col items-center gap-1.5 rounded-[10px] px-1 py-2 transition-colors hover:bg-white/5 active:scale-[0.95]"
                  >
                    <Glyph
                      name={item.icon}
                      size={20}
                      className="text-[color:var(--primary)] drop-shadow-[0_0_8px_var(--glow)]"
                    />
                    <span className="text-[0.66rem] font-semibold text-white/65">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

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

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-slide]'));
    if (!cards.length) return;
    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const center = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(center - scrollCenter);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    if (bestIdx !== activeIdx) setActiveIdx(bestIdx);
  };

  const scrollToIdx = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-slide]');
    const card = cards[idx];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden border-y border-[color:var(--line)] bg-[color:var(--surface)] py-16">
      <div className="jw-grid absolute inset-0 opacity-30" />

      <div className="relative">
        {/* ============ Dashboard Card ============ */}
        <Reveal className="px-5">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <div
              className="pointer-events-none absolute -top-32 -end-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-32 -start-24 h-64 w-64 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(circle, #0d1f3f, transparent 70%)' }}
            />

            <div className="relative">
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

              <div className="mt-6" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
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

              <div
                className="relative mt-5 h-16 w-full"
                style={{
                  maskImage: 'linear-gradient(to bottom, #000 45%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, #000 45%, transparent 100%)',
                }}
              >
                <svg viewBox="0 0 300 80" className="h-full w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="jw-chart-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2bd38c" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#2bd38c" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="jw-chart-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2bd38c" />
                      <stop offset="100%" stopColor="#7fc5ff" />
                    </linearGradient>
                    <filter id="jw-chart-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d="M0,60 C40,58 70,58 110,42 C150,26 190,36 230,20 C260,10 285,12 300,8"
                    fill="none"
                    stroke="#2bd38c"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.16"
                    style={{ filter: 'blur(6px)' }}
                  />
                  <path
                    d="M0,60 C40,58 70,58 110,42 C150,26 190,36 230,20 C260,10 285,12 300,8 L300,80 L0,80 Z"
                    fill="url(#jw-chart-area)"
                  />
                  <path
                    d="M0,60 C40,58 70,58 110,42 C150,26 190,36 230,20 C260,10 285,12 300,8"
                    fill="none"
                    stroke="url(#jw-chart-line)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    filter="url(#jw-chart-glow)"
                  />
                  <circle cx="110" cy="42" r="2.8" fill="#0a1f24" stroke="#2bd38c" strokeWidth="1.8" />
                  <circle cx="230" cy="20" r="2.8" fill="#0a1f24" stroke="#7fc5ff" strokeWidth="1.8" />
                </svg>
              </div>

              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />

              <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                {miniStats.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <div
                      className="flex items-center gap-2.5"
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                    >
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center"
                        style={{
                          color: s.color,
                          filter: `drop-shadow(0 0 7px ${s.color}80)`,
                        }}
                      >
                        <Glyph name={s.icon} size={18} strokeWidth={1.9} />
                      </span>
                      <div className="flex items-baseline gap-0.5">
                        <span
                          className="text-[1.55rem] font-black leading-none tracking-tight"
                          style={{ color: s.color, textShadow: `0 0 14px ${s.color}55` }}
                        >
                          <Counter to={s.value} locale="en-US" />
                        </span>
                        <span
                          className="text-[1.1rem] font-black leading-none"
                          style={{ color: s.color }}
                        >
                          +
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-[0.7rem] font-medium leading-snug text-white/65">
                      {bi(s.label)}
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

        {/* ============ Horizontal Glassmorphic Slider ============ */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-scrollbar mt-8 flex gap-4 overflow-x-auto px-5 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {points.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={p.n}
                data-slide
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-2xl transition-all duration-500',
                  isActive ? 'opacity-100' : 'opacity-75',
                )}
                style={{
                  width: '82%',
                  scrollSnapAlign: 'center',
                }}
              >
                <div
                  className="pointer-events-none absolute -top-16 -end-16 h-40 w-40 rounded-full opacity-25 blur-3xl transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle, #2bd38c, transparent 70%)',
                    opacity: isActive ? 0.35 : 0.15,
                  }}
                />

                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <span
                      className="font-mono text-[0.72rem] font-bold tracking-[0.3em] text-[#5fe0a5]"
                      style={{ textShadow: '0 0 10px rgba(43, 211, 140, 0.5)' }}
                    >
                      {p.n}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#2bd38c]/40 to-transparent ms-3" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border border-white/10 bg-white/[0.04] text-[#5fe0a5]"
                      style={{
                        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08), 0 0 20px -8px #2bd38c',
                      }}
                    >
                      <Glyph name={p.icon} size={20} strokeWidth={1.8} />
                    </span>
                    <h3 className="text-[1.1rem] font-extrabold leading-tight tracking-tight text-white">
                      {p.title}
                    </h3>
                  </div>

                  <p className="mt-4 text-[0.85rem] leading-[1.9] text-white/60">{p.body}</p>
                </div>
              </div>
            );
          })}
          <div className="shrink-0" style={{ width: '10%' }} />
        </div>

        {/* ============ Pagination Dots ============ */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {points.map((_, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-400"
                style={{
                  width: isActive ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '999px',
                  background: isActive ? '#2bd38c' : 'rgba(255,255,255,0.18)',
                  boxShadow: isActive ? '0 0 12px #2bd38c80' : 'none',
                }}
              />
            );
          })}
        </div>
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
    <footer className="relative overflow-hidden px-5 pb-32 pt-14">
      <div
        className="pointer-events-none absolute -top-20 start-1/3 h-48 w-48 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 end-1/4 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0d1f3f, transparent 70%)' }}
      />

      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-2xl"
              style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
            />
            <BrandMark size={42} className="drop-shadow-[0_10px_24px_rgba(43,211,140,0.3)]" />
          </div>
          <div className="min-w-0">
            <div className="text-[0.95rem] font-extrabold tracking-tight">
              {bi(appConfig.companyName)}
            </div>
            <div className="mt-0.5 text-[0.66rem] uppercase tracking-[0.22em] text-[color:var(--faint)]">
              {c.website}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-2xl shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)]">
              <Glyph name="pin" size={15} strokeWidth={1.9} />
            </span>
            <p className="pt-1 text-[0.82rem] leading-relaxed text-[color:var(--text)]">
              {bi(c.address)}
            </p>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)]">
              <Glyph name="phone" size={15} strokeWidth={1.9} />
            </span>
            <p
              dir="ltr"
              className="pt-1 text-[0.82rem] leading-relaxed text-start text-[color:var(--text)]"
            >
              {c.phone} · {c.mobile1} · {c.mobile2}
            </p>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)]">
              <Glyph name="mail" size={15} strokeWidth={1.9} />
            </span>
            <p
              dir="ltr"
              className="pt-1 text-[0.82rem] leading-relaxed text-start text-[color:var(--text)]"
            >
              {c.email}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => externalActions.call(c.phone)}
            className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 px-5 py-2.5 text-[0.82rem] font-semibold text-[color:var(--primary)] backdrop-blur-xl transition-all duration-300 active:scale-[0.97]"
          >
            <Glyph name="phone" size={15} strokeWidth={1.9} />
            {t('quick.call')}
          </button>

          <button
            type="button"
            onClick={() => externalActions.whatsapp(c.whatsapp)}
            className="group inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-2.5 text-[0.82rem] font-semibold text-[#4bdb7f] backdrop-blur-xl transition-all duration-300 active:scale-[0.97]"
          >
            <Glyph name="whatsapp" size={15} strokeWidth={1.9} />
            {t('quick.whatsapp')}
          </button>

          <button
            type="button"
            onClick={() => push({ name: 'contact' })}
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[0.82rem] font-semibold text-white/80 backdrop-blur-xl transition-all duration-300 active:scale-[0.97]"
          >
            <Glyph name="mail" size={15} strokeWidth={1.9} />
            {t('contact.title')}
          </button>
        </div>

        <p className="mt-8 text-center text-[0.68rem] tracking-wide text-[color:var(--faint)]">
          {t('dev.credit')} — {bi(appConfig.developer.name)}
        </p>
      </div>
    </footer>
  );
}

export function HomeScreen() {
  const { t } = useI18n();
  const { push } = useNav();
  const { openDrawer } = useDrawer();

  return (
    <div>
      <Hero onMenuClick={openDrawer} />
      
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

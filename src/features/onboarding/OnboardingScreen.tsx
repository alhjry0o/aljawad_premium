import { useState } from 'react';
import { useI18n } from '../../core/i18n';
import { BrandMark, MaterialIcon3D, Glyph } from '../../components/icons';
import { cn } from '../../utils/cn';

const ONBOARDING_KEY = 'aljawad.onboarding.v1';

interface Slide {
  icon: 'brand' | 'hands-tools' | 'work-order' | 'check';
  accent: 'green' | 'navy' | 'blue' | 'teal';
  title: { ar: string; en: string };
  body: { ar: string; en: string };
}

const SLIDES: Slide[] = [
  {
    icon: 'brand',
    accent: 'green',
    title: { ar: 'أهلاً بك في منصة الجواد', en: 'Welcome to Aljawad Platform ' },
    body: {
      ar: 'شريكك الموثوق لحلول النظافة والصيانة المتكاملة في المملكة',
      en: 'Your trusted partner for integrated cleaning and maintenance solutions in the Kingdom',
    },
  },
  {
    icon: 'hands-tools',
    accent: 'navy',
    title: { ar: 'خدمات متكاملة', en: 'Integrated services' },
    body: {
      ar: '11 خدمة احترافية — من النظافة العميقة إلى العزل والصيانة',
      en: '11 professional services — from deep cleaning to insulation and maintenance',
    },
  },
  {
    icon: 'work-order',
    accent: 'blue',
    title: { ar: 'اطلب بسهولة', en: 'Order with ease' },
    body: {
      ar: 'أنشئ طلبك في خطوات قليلة — خدمة، عرض سعر، أو معاينة',
      en: 'Create your request in a few steps — service, quote, or inspection',
    },
  },
  {
    icon: 'check',
    accent: 'green',
    title: { ar: 'أنت جاهز', en: 'You are all set' },
    body: {
      ar: 'ابدأ الآن باستكشاف خدماتنا ومشاريعنا',
      en: 'Start now by exploring our services and projects',
    },
  },
];

/* Custom SVG — Hands holding tools */
function HandsToolsIcon({ size = 140, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ht-circle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2bd38c" />
          <stop offset="55%" stopColor="#1fa36a" />
          <stop offset="100%" stopColor="#13406d" />
        </linearGradient>
        <linearGradient id="ht-hands" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5fe0a5" />
          <stop offset="100%" stopColor="#1fa36a" />
        </linearGradient>
        <linearGradient id="ht-tool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#7fc5ff" />
        </linearGradient>
      </defs>

      {/* circle badge */}
      <circle cx="60" cy="38" r="24" fill="url(#ht-circle)" />
      <circle cx="60" cy="38" r="24" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.8" />

      {/* wrench (left, tilted) */}
      <g transform="translate(60 38) rotate(-35)">
        <rect x="-1.4" y="-13" width="2.8" height="14" rx="1" fill="url(#ht-tool)" />
        <path
          d="M-4,-15.5 a3,3 0 1,1 8,0 v1.5 h-2 v-1.5 a1,1 0 1,0 -4,0 v1.5 h-2 z"
          fill="url(#ht-tool)"
        />
        <circle cx="0" cy="1.5" r="2.2" fill="none" stroke="#ffffff" strokeWidth="0.6" />
      </g>

      {/* screwdriver (right, tilted) */}
      <g transform="translate(60 38) rotate(35)">
        <rect x="-1.2" y="-13" width="2.4" height="12" rx="0.8" fill="url(#ht-tool)" />
        <path d="M-1.6,-13 h3.2 v-3 l-1.6,-2 l-1.6,2 z" fill="url(#ht-tool)" />
        <rect x="-0.6" y="-1" width="1.2" height="4" fill="#ffffff" opacity="0.85" />
      </g>

      {/* cross point */}
      <circle cx="60" cy="38" r="1.6" fill="#ffffff" opacity="0.9" />

      {/* left hand (cupping) */}
      <path
        d="M18 62
           C16 74 20 92 30 100
           C34 103 38 102 40 100
           L40 82
           C40 78 44 74 48 74
           L54 74
           C56 74 56 76 54 77
           L48 79
           C46 80 46 82 48 82
           L54 82
           C56 83 56 84 54 85
           L48 86
           C46 87 46 89 48 89
           L54 89
           C56 90 55 91 53 92
           L46 93
           C42 94 40 96 40 99
           L40 102
           M18 62
           L18 72
           C18 76 20 78 22 78"
        fill="none"
        stroke="url(#ht-hands)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* right hand (cupping, mirrored) */}
      <path
        d="M102 62
           C104 74 100 92 90 100
           C86 103 82 102 80 100
           L80 82
           C80 78 76 74 72 74
           L66 74
           C64 74 64 76 66 77
           L72 79
           C74 80 74 82 72 82
           L66 82
           C64 83 64 84 66 85
           L72 86
           C74 87 74 89 72 89
           L66 89
           C64 90 65 91 67 92
           L74 93
           C78 94 80 96 80 99
           L80 102
           M102 62
           L102 72
           C102 76 100 78 98 78"
        fill="none"
        stroke="url(#ht-hands)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* center pedestal between hands */}
      <path
        d="M46 100 L74 100"
        stroke="url(#ht-hands)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Custom SVG — Work order with wrench + gear + person */
function WorkOrderIcon({ size = 150, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2bd38c" />
          <stop offset="50%" stopColor="#5fe0a5" />
          <stop offset="100%" stopColor="#7fc5ff" />
        </linearGradient>
      </defs>

      {/* Document body */}
      <path
        d="M32 26 H88 L106 44 V108 H32 Z"
        stroke="url(#wo-grad)"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Folded corner */}
      <path
        d="M88 26 V44 H106"
        stroke="url(#wo-grad)"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Wrench + Gear */}
      <g transform="translate(62 60)">
        <circle r="10" stroke="url(#wo-grad)" strokeWidth="2.4" />
        <circle r="3.5" stroke="url(#wo-grad)" strokeWidth="2.4" />
        <g stroke="url(#wo-grad)" strokeWidth="2.6" strokeLinecap="round">
          <line x1="0" y1="-13" x2="0" y2="-10.8" />
          <line x1="0" y1="13" x2="0" y2="10.8" />
          <line x1="-13" y1="0" x2="-10.8" y2="0" />
          <line x1="13" y1="0" x2="10.8" y2="0" />
          <line x1="-9.2" y1="-9.2" x2="-7.6" y2="-7.6" />
          <line x1="9.2" y1="9.2" x2="7.6" y2="7.6" />
          <line x1="-9.2" y1="9.2" x2="-7.6" y2="7.6" />
          <line x1="9.2" y1="-9.2" x2="7.6" y2="-7.6" />
        </g>
        <g transform="rotate(-40)">
          <rect x="-2" y="-20" width="4" height="11" rx="1.5" fill="url(#wo-grad)" />
          <path
            d="M-4.5 -22 a4.5 4.5 0 1 1 9 0 v2 h-3 v-2 a1.5 1.5 0 1 0 -3 0 v2 h-3 z"
            fill="url(#wo-grad)"
          />
        </g>
      </g>

      {/* Checklist */}
      <g>
        <rect x="42" y="84" width="4" height="4" rx="0.5" fill="url(#wo-grad)" />
        <line x1="50" y1="86" x2="74" y2="86" stroke="url(#wo-grad)" strokeWidth="2.4" strokeLinecap="round" />

        <rect x="42" y="94" width="4" height="4" rx="0.5" fill="url(#wo-grad)" />
        <line x1="50" y1="96" x2="74" y2="96" stroke="url(#wo-grad)" strokeWidth="2.4" strokeLinecap="round" />

        <rect x="42" y="104" width="4" height="4" rx="0.5" fill="url(#wo-grad)" />
        <line x1="50" y1="106" x2="66" y2="106" stroke="url(#wo-grad)" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* Person silhouette */}
      <g fill="url(#wo-grad)">
        <circle cx="103" cy="82" r="8" />
        <path d="M89 112 c0 -7.7 6.3 -14 14 -14 s14 6.3 14 14 z" />
      </g>
    </svg>
  );
}

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const { bi, dir } = useI18n();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const goNext = () => {
    if (isLast) onComplete();
    else setIndex((i) => i + 1);
  };

  return (
    <div
      dir={dir}
      className="relative mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col overflow-hidden bg-[color:var(--bg)] text-[color:var(--text)]"
    >
      {/* decorative grid + glows */}
      <div className="jw-grid absolute inset-0 opacity-[0.08]" />
      <div
        className="pointer-events-none absolute -top-32 start-1/4 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #1fa36a, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 end-1/4 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0d1f3f, transparent 70%)' }}
      />

      {/* skip */}
      <div className="relative z-10 flex justify-end px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
        {!isLast && (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-full border border-white/10 px-4 py-1.5 text-[0.72rem] font-semibold text-white/55 transition-colors hover:text-white/85"
          >
            {bi({ ar: 'تخطي', en: 'Skip' })}
          </button>
        )}
      </div>

      {/* content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 text-center">
        <div key={`icon-${index}`} className="jw-rise">
         {slide.icon === 'brand' ? (
          <div className="relative">
           <div
            className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full opacity-60 blur-3xl"
            style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
          />
          <BrandMark size={140} className="jw-float drop-shadow-[0_20px_40px_rgba(43,211,140,0.35)]" />
        </div>
      ) : slide.icon === 'hands-tools' ? (
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
          />
          <HandsToolsIcon size={160} className="jw-float drop-shadow-[0_20px_40px_rgba(43,211,140,0.3)]" />
        </div>
      ) : slide.icon === 'work-order' ? (
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
          />
          <WorkOrderIcon size={150} className="jw-float drop-shadow-[0_20px_40px_rgba(43,211,140,0.3)]" />
        </div>
      ) : (
        <MaterialIcon3D
         name={slide.icon}
         accent={slide.accent}
         size={140}
         className="jw-float"
        />
      )}

        <h1
          key={`t-${index}`}
          className="jw-rise mt-10 text-[1.75rem] font-extrabold leading-tight tracking-tight"
          style={{ animationDelay: '120ms' }}
        >
          {bi(slide.title)}
        </h1>

        <p
          key={`b-${index}`}
          className="jw-rise mt-4 max-w-[36ch] text-[0.92rem] leading-relaxed text-[color:var(--muted)]"
          style={{ animationDelay: '220ms' }}
        >
          {bi(slide.body)}
        </p>
      </div>

      {/* bottom */}
      <div className="relative z-10 px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-6">
        {/* dots */}
        <div className="mb-6 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-400',
                i === index ? 'w-8 bg-[color:var(--primary)]' : 'w-1.5 bg-white/20',
              )}
            />
          ))}
        </div>

        {/* primary */}
        <button
          type="button"
          onClick={goNext}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-sm)] bg-[color:var(--primary)] px-6 py-4 text-[0.95rem] font-semibold text-[color:var(--primary-ink)] shadow-[0_10px_30px_-12px_var(--glow)] transition-all duration-300 active:scale-[0.98]"
        >
          <span className="relative">
            {isLast
              ? bi({ ar: 'ابدأ الآن', en: 'Get started' })
              : bi({ ar: 'التالي', en: 'Next' })}
          </span>
          <Glyph name="arrow" size={18} className="relative rtl:-scale-x-100" />
        </button>

        {/* back */}
        {index > 0 && (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="mt-3 w-full py-2 text-[0.82rem] font-medium text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
          >
            {bi({ ar: 'السابق', en: 'Back' })}
          </button>
        )}
      </div>
    </div>
  );
}

export { ONBOARDING_KEY };

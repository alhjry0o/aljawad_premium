import { useState } from 'react';
import { useI18n } from '../../core/i18n';
import { BrandMark, MaterialIcon3D, Glyph } from '../../components/icons';
import { cn } from '../../utils/cn';

const ONBOARDING_KEY = 'aljawad.onboarding.v1';

interface Slide {
  icon: 'brand' | 'building' | 'checklist' | 'check';
  accent: 'green' | 'navy' | 'blue' | 'teal';
  title: { ar: string; en: string };
  body: { ar: string; en: string };
}

const SLIDES: Slide[] = [
  {
    icon: 'brand',
    accent: 'green',
    title: { ar: 'أهلاً بك في منصة الجواد', en: 'Welcome to Aljawad Platform' },
    body: {
      ar: 'شريكك الموثوق لحلول النظافة والصيانة المتكاملة في المملكة',
      en: 'Your trusted partner for integrated cleaning and maintenance solutions in the Kingdom',
    },
  },
  {
    icon: 'building',
    accent: 'navy',
    title: { ar: 'خدمات متكاملة', en: 'Integrated services' },
    body: {
      ar: '11 خدمة احترافية — من النظافة العميقة إلى العزل والصيانة',
      en: '11 professional services — from deep cleaning to insulation and maintenance',
    },
  },
  {
    icon: 'checklist',
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
      <div className="jw-grid absolute inset-0 opacity-[0.08]" />
      <div
        className="pointer-events-none absolute -top-32 start-1/4 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #1fa36a, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 end-1/4 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0d1f3f, transparent 70%)' }}
      />

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
          ) : (
            <MaterialIcon3D
              name={slide.icon}
              accent={slide.accent}
              size={140}
              className="jw-float"
            />
          )}
        </div>

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

      <div className="relative z-10 px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-6">
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

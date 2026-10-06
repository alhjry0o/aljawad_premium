import { useCallback, useEffect, useRef, useState } from 'react';
import { services, type Service } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { MaterialIcon3D } from '../../components/icons';
import { Glyph } from '../../components/icons';

/**
 * Premium editorial carousel.
 * The focused service is full-weight; neighbours recede in scale, depth
 * and luminance — browse → focus → discover → open.
 */
export function ServiceCarousel() {
  const { bi, t } = useI18n();
  const { push } = useNav();
  const { reducedMotion } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((node, index) => {
      const el = node as HTMLElement;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - elCenter);
      const ratio = Math.min(1, dist / (el.offsetWidth * 1.05));
      if (!reducedMotion) {
        el.style.transform = `scale(${1 - ratio * 0.085}) translateY(${ratio * 14}px)`;
        el.style.opacity = `${1 - ratio * 0.45}`;
      } else {
        el.style.transform = '';
        el.style.opacity = '';
      }
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    setActive(best);
  }, [reducedMotion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [update]);

  const activeService: Service = services[active] ?? services[0];

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar snap-x-mandatory flex gap-4 overflow-x-auto px-[max(1.25rem,calc((100%-20rem)/2))] pb-4 pt-2"
        style={{ scrollBehavior: reducedMotion ? 'auto' : 'smooth' }}
      >
        {services.map((service) => (
          <article
            key={service.id}
            className="snap-center-item relative w-[19rem] shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line)] transition-[transform,opacity] duration-300 will-change-transform"
            style={{ transformOrigin: 'center bottom' }}
          >
            <button
              type="button"
              onClick={() => push({ name: 'service', id: service.id })}
              className="block w-full text-start"
              aria-label={bi(service.title)}
            >
              <div className="relative h-[22rem] w-full overflow-hidden">
                <img
                  src={service.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/70 to-[#030605]/15" />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 opacity-60"
                  style={{
                    background: `radial-gradient(120% 80% at 20% 100%, var(--glow), transparent 70%)`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[0.7rem] tracking-[0.3em] text-white/55">
                      {service.number}
                    </span>
                    <MaterialIcon3D name={service.id} accent={service.accent} size={62} className="jw-float" />
                  </div>
                  <div>
                    <h3 className="text-[1.35rem] font-bold leading-snug tracking-tight text-white">
                      {bi(service.title)}
                    </h3>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-white/65">
                      {bi(service.statement)}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[0.75rem] font-semibold text-[#5fe0a5]">
                      {t('services.open')}
                      <Glyph name="arrow" size={15} className="rtl:-scale-x-100" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>

      {/* progress rail */}
      <div className="mt-2 flex items-center gap-3 px-5">
        <span className="font-mono text-[0.7rem] text-[color:var(--muted)]">{activeService.number}</span>
        <div className="relative h-px flex-1 bg-[color:var(--line)]">
          <span
            className="absolute inset-y-0 h-px bg-[color:var(--primary)] transition-all duration-500"
            style={{ width: `${((active + 1) / services.length) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[0.7rem] text-[color:var(--faint)]">
          {String(services.length).padStart(2, '0')}
        </span>
      </div>
      <p className="mt-2 px-5 text-[0.7rem] text-[color:var(--faint)]">{t('services.swipe')}</p>
    </div>
  );
}

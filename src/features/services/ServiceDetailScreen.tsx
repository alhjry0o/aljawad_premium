import { getService, type ServiceIconKey } from '../../data/services';
import { projects } from '../../data/projects';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { useCompany } from '../../core/companyStore';
import { externalActions } from '../../core/actions';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, DemoBadge, Reveal, useScrollY } from '../../components/kit';

export function ServiceDetailScreen({ id }: { id: ServiceIconKey }) {
  const service = getService(id);
  const { t, bi, list } = useI18n();
  const { push, back } = useNav();
  const { reducedMotion } = useTheme();
  const { config: appConfig } = useCompany();
  const y = useScrollY();

  const handleShare = () => {
    if (!service) return;
    const message =
      `${bi(service.title)}\n${bi(service.statement)}\n\n` +
      `🔗 https://${appConfig.contact.website}`;
    externalActions.shareToWhatsapp(message);
  };

  if (!service) {
    return (
      <div className="px-5 py-24 text-center text-[color:var(--muted)]">
        {t('error.generic')}
      </div>
    );
  }

  const related = projects.filter((p) => p.serviceId === service.id);
  const p = reducedMotion ? 0 : Math.min(y, 400);

  return (
    <div className="pb-32">
      {/* ============ Immersive Hero ============ */}
      <section className="relative h-[62svh] overflow-hidden bg-[#030605]">
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * 0.3}px, 0) scale(${1 + p * 0.0005})` }}
        >
          <img src={service.image} alt="" className="h-full w-full object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/35 to-[#030605]/65" />

        <div className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-[520px] px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              aria-label={t('common.back')}
              className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl"
            >
              <Glyph name="arrow" size={18} className="ltr:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label={t('common.share')}
              className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl"
            >
              <Glyph name="whatsapp" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ Glassmorphic Header Card (overlaps hero) ============ */}
      <section className="relative z-10 -mt-16 px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div
              className="pointer-events-none absolute -top-20 -end-16 h-40 w-40 rounded-full opacity-25 blur-3xl"
              style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
            />

            <div className="relative">
              <div className="flex items-start justify-between">
                <span
                  className="font-mono text-[0.62rem] font-bold tracking-[0.3em] text-[#5fe0a5]"
                  style={{ textShadow: '0 0 10px rgba(43, 211, 140, 0.5)' }}
                >
                  {service.number}
                </span>
                <MaterialIcon3D name={service.id} accent={service.accent} size={68} />
              </div>

              <h1 className="mt-3 text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-white">
                {bi(service.title)}
              </h1>

              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-white/60">
                {bi(service.statement)}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ Long Description ============ */}
      <Reveal className="px-5 pt-8">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl">
          <p className="text-[0.88rem] leading-[1.95] text-[color:var(--muted)]">
            {bi(service.description)}
          </p>
        </div>
      </Reveal>

      {/* ============ Includes — Glass Capsules Grid ============ */}
      <Reveal className="px-5 pt-8">
        <h2 className="mb-4 text-[1.05rem] font-bold tracking-tight">
          {t('services.includes')}
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {list(service.includes).map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#2bd38c]/40 bg-[#2bd38c]/12"
                style={{ filter: 'drop-shadow(0 0 6px rgba(43,211,140,0.5))' }}
              >
                <Glyph name="check" size={11} strokeWidth={2.4} className="text-[#5fe0a5]" />
              </span>
              <span className="text-[0.76rem] font-medium leading-tight text-white/80">
                {item}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ Related Projects ============ */}
      {related.length > 0 && (
        <Reveal className="pt-10">
          <div className="mb-5 flex items-center justify-between px-5">
            <h2 className="text-[1.05rem] font-bold tracking-tight">
              {t('services.related')}
            </h2>
            <DemoBadge label={t('common.demo')} />
          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2">
            {related.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => push({ name: 'project', id: project.id })}
                className="group relative h-52 w-72 shrink-0 overflow-hidden rounded-[20px] border border-white/10 text-start shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]"
              >
                <img
                  src={project.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 to-transparent" />

                <div className="absolute inset-x-2.5 bottom-2.5 overflow-hidden rounded-[14px] border border-white/12 bg-black/35 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                  <div className="p-3">
                    <span className="font-mono text-[0.58rem] tracking-[0.22em] text-white/55">
                      {project.code}
                    </span>
                    <h3 className="mt-1 text-[0.9rem] font-bold leading-snug text-white">
                      {bi(project.title)}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      )}

      {/* ============ Premium Action Panel ============ */}
      <Reveal className="px-5 pt-10">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-3 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          {/* Primary CTA — full width capsule with neon glow */}
          <button
            type="button"
            onClick={() => push({ name: 'flow', kind: 'service', serviceId: service.id })}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--primary)] px-6 py-4 text-[0.95rem] font-bold tracking-tight text-[color:var(--primary-ink)] shadow-[0_14px_38px_-12px_var(--glow),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-[0.97]"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 group-hover:[animation:jw-sweep_0.9s_ease-out]" />
            <span className="relative text-center break-words">
              {t('hero.cta.primary')}
            </span>
            <Glyph name="arrow" size={18} className="relative shrink-0 rtl:-scale-x-100" />
          </button>

          {/* Secondary actions — flexible row, wraps gracefully */}
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => push({ name: 'flow', kind: 'quote', serviceId: service.id })}
              className="group flex min-w-[140px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#2bd38c]/30 bg-[#2bd38c]/8 px-4 py-3 text-[0.82rem] font-semibold text-[#5fe0a5] backdrop-blur-xl transition-all duration-300 active:scale-[0.97]"
            >
              <Glyph name="quote" size={14} strokeWidth={1.9} className="shrink-0" />
              <span className="text-center break-words">
                {t('hero.cta.secondary')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => push({ name: 'flow', kind: 'inspection', serviceId: service.id })}
              className="group flex min-w-[140px] flex-1 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-3 text-[0.82rem] font-semibold text-white/80 backdrop-blur-xl transition-all duration-300 active:scale-[0.97]"
            >
              <Glyph name="inspect" size={14} strokeWidth={1.9} className="shrink-0" />
              <span className="text-center break-words">
                {t('flow.inspection.title')}
              </span>
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

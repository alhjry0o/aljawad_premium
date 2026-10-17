import { useMemo, useState } from 'react';
import { useProject, useProjects } from '../../core/projectsStore';
import { getService, services } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { useCompany } from '../../core/companyStore';
import { externalActions } from '../../core/actions';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, DemoBadge, Reveal, ScreenHeader, useScrollY } from '../../components/kit';
import { cn } from '../../utils/cn';

/* ------------------------------------------------------------ Filter chip */

function FilterChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-[0.78rem] backdrop-blur-xl transition-all duration-300',
        active
          ? 'border-[#2bd38c]/60 bg-[#2bd38c]/12 font-bold text-[#5fe0a5] shadow-[0_0_0_3px_rgba(43,211,140,0.08),0_0_22px_-6px_var(--glow)]'
          : 'border-white/10 bg-white/[0.035] font-medium text-white/60 hover:border-white/20 hover:text-white/85',
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------ Projects list */

export function ProjectsScreen() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { projects } = useProjects();
  const [filter, setFilter] = useState<string>('all');

  const usedServices = useMemo(
    () => services.filter((s) => projects.some((p) => p.serviceId === s.id)),
    [projects],
  );
  const visible = filter === 'all' ? projects : projects.filter((p) => p.serviceId === filter);

  return (
    <div className="pb-32">
      <ScreenHeader
        title={t('projects.title')}
        subtitle={t('projects.demoNote')}
        trailing={<DemoBadge label={t('common.demo')} />}
      />

      {/* Filter chips — glassmorphic */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-4">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          {t('projects.filter.all')}
        </FilterChip>
        {usedServices.map((s) => (
          <FilterChip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
            {bi(s.title)}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-5 px-5">
        {visible.map((project, i) => {
          const service = getService(project.serviceId);
          const tall = i % 3 === 0;
          return (
            <Reveal key={project.id} delay={(i % 3) * 70}>
              <button
                type="button"
                onClick={() => push({ name: 'project', id: project.id })}
                className="group relative block w-full overflow-hidden rounded-[24px] border border-white/10 text-start shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] transition-all duration-300 active:scale-[0.99]"
                style={{ height: tall ? '27rem' : '19rem' }}
              >
                <img
                  src={project.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]"
                />

                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                  <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.22em] text-white/75 backdrop-blur">
                    {project.code}
                  </span>
                  {service && (
                    <MaterialIcon3D name={service.id} accent={service.accent} size={48} />
                  )}
                </div>

                <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-[18px] border border-white/12 bg-black/35 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <div className="p-4">
                    <h3 className="text-[1.15rem] font-extrabold leading-snug tracking-tight text-white">
                      {bi(project.title)}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-relaxed text-white/60">
                      {bi(project.summary)}
                    </p>

                    <div className="mt-3 flex items-center gap-3 text-[0.68rem] font-medium">
                      <span className="flex items-center gap-1 text-white/55">
                        <Glyph name="pin" size={12} />
                        {bi({ ar: 'الرياض', en: 'Riyadh' })}
                      </span>
                      <span className="flex items-center gap-1 text-white/55">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2bd38c] shadow-[0_0_6px_#2bd38c]" />
                        {bi({ ar: 'مكتمل', en: 'Completed' })}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Project detail */

export function ProjectDetailScreen({ id }: { id: string }) {
  const project = useProject(id);
  const { t, bi, list } = useI18n();
  const { push, back } = useNav();
  const { reducedMotion } = useTheme();
  const { config: appConfig } = useCompany();
  const y = useScrollY();

  const handleShare = () => {
    if (!project) return;
    const message =
      `${bi(project.title)}\n${bi(project.summary)}\n\n` +
      `🔗 https://${appConfig.contact.website}`;
    externalActions.shareToWhatsapp(message);
  };

  if (!project) {
    return <div className="px-5 py-24 text-center text-[color:var(--muted)]">{t('error.generic')}</div>;
  }

  const service = getService(project.serviceId);
  const p = reducedMotion ? 0 : Math.min(y, 420);

  return (
    <div className="pb-32">
      {/* ============ Immersive Hero ============ */}
      <section className="relative h-[62svh] overflow-hidden bg-[#030605]">
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * 0.3}px, 0) scale(${1 + p * 0.0005})` }}
        >
          <img src={project.cover} alt="" className="h-full w-full object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/35 to-[#030605]/65" />

        {/* floating back + share buttons */}
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
                  className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.22em] text-white/75 backdrop-blur"
                >
                  {project.code}
                </span>
                {service && <MaterialIcon3D name={service.id} accent={service.accent} size={48} />}
              </div>

              <h1 className="mt-3 text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-white">
                {bi(project.title)}
              </h1>

              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-white/60">
                {bi(project.summary)}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ Service Link ============ */}
      {service && (
        <Reveal className="px-5 pt-6">
          <button
            type="button"
            onClick={() => push({ name: 'service', id: service.id })}
            className="flex w-full items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.035] p-3 text-start backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
          >
            <MaterialIcon3D name={service.id} accent={service.accent} size={40} />
            <div className="min-w-0 flex-1">
              <div className="text-[0.62rem] uppercase tracking-[0.22em] text-[color:var(--faint)]">
                {t('projects.service')}
              </div>
              <div className="mt-0.5 truncate text-[0.92rem] font-bold text-[color:var(--text)]">
                {bi(service.title)}
              </div>
            </div>
            <Glyph name="arrow" size={14} className="shrink-0 text-[color:var(--faint)] rtl:-scale-x-100" />
          </button>
        </Reveal>
      )}

      {/* ============ Context ============ */}
      <Reveal className="px-5 pt-8">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl">
          <h2 className="mb-2 text-[1.05rem] font-bold tracking-tight">
            {t('projects.context')}
          </h2>
          <p className="text-[0.88rem] leading-[1.95] text-[color:var(--muted)]">
            {bi(project.context)}
          </p>
        </div>
      </Reveal>

      {/* ============ Scope — 2x2 Glass Grid ============ */}
      <Reveal className="px-5 pt-8">
        <h2 className="mb-4 text-[1.05rem] font-bold tracking-tight">
          {t('projects.scope')}
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {list(project.scope).map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
            >
              <span
                className="font-mono text-[0.62rem] font-bold tracking-[0.15em] text-[#5fe0a5]"
                style={{ textShadow: '0 0 8px rgba(43,211,140,0.6)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.76rem] font-medium leading-tight text-white/80">
                {item}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ Gallery — Horizontal Carousel ============ */}
      {project.gallery.length > 0 && (
        <Reveal className="pt-8">
          <h2 className="mb-4 px-5 text-[1.05rem] font-bold tracking-tight">
            {t('projects.gallery')}
          </h2>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
            {project.gallery.map((src, i) => (
              <div
                key={i}
                className="relative h-64 w-[80%] shrink-0 snap-center overflow-hidden rounded-[16px] border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.95)]"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* subtle bottom gradient for depth */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* ============ Premium CTA ============ */}
      <Reveal className="px-5 pt-10">
        <button
          type="button"
          onClick={() => push({ name: 'flow', kind: 'service', serviceId: project.serviceId })}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--primary)] px-6 py-4 text-[0.95rem] font-bold tracking-tight text-[color:var(--primary-ink)] shadow-[0_14px_38px_-12px_var(--glow),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-[0.97]"
        >
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 group-hover:[animation:jw-sweep_0.9s_ease-out]" />
          <span className="relative text-center break-words">
            {t('projects.cta')}
          </span>
          <Glyph name="arrow" size={18} className="relative shrink-0 rtl:-scale-x-100" />
        </button>
      </Reveal>
    </div>
  );
}

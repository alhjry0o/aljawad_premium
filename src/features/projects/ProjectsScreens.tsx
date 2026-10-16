import { useMemo, useState } from 'react';
import { useProject, useProjects } from '../../core/projectsStore';
import { getService, services } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
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
                {/* Full-bleed image */}
                <img
                  src={project.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]"
                />

                {/* Very soft top gradient for code readability */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

                {/* top row: code chip + service 3D icon */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                  <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.22em] text-white/75 backdrop-blur">
                    {project.code}
                  </span>
                  {service && (
                    <MaterialIcon3D name={service.id} accent={service.accent} size={48} />
                  )}
                </div>

                {/* Integrated glassmorphic overlay at bottom */}
                <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-[18px] border border-white/12 bg-black/35 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <div className="p-4">
                    <h3 className="text-[1.15rem] font-extrabold leading-snug tracking-tight text-white">
                      {bi(project.title)}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-relaxed text-white/60">
                      {bi(project.summary)}
                    </p>

                    {/* meta row: location + status */}
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
  const y = useScrollY();

  if (!project) {
    return <div className="px-5 py-24 text-center text-[color:var(--muted)]">{t('error.generic')}</div>;
  }

  const service = getService(project.serviceId);
  const p = reducedMotion ? 0 : Math.min(y, 420);

  return (
    <div className="pb-32">
      <section className="relative h-[78svh] overflow-hidden bg-[#030605]">
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * 0.3}px, 0) scale(${1 + p * 0.0005})` }}
        >
          <img src={project.cover} alt="" className="h-full w-full object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/35 to-[#030605]/60" />

        <div className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-[520px] px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <button
            type="button"
            onClick={back}
            aria-label={t('common.back')}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] border border-white/15 bg-black/40 text-white backdrop-blur"
          >
            <Glyph name="arrow" size={18} className="ltr:-scale-x-100" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <DemoBadge label={project.code} />
          <h1 className="mt-4 text-[2.1rem] font-extrabold leading-[1.12] tracking-tight text-white">
            {bi(project.title)}
          </h1>
          <p className="mt-3 max-w-[42ch] text-[0.88rem] leading-relaxed text-white/65">
            {bi(project.summary)}
          </p>
        </div>
      </section>

      <Reveal className="flex items-center gap-4 border-b border-[color:var(--line)] px-5 py-5">
        {service && <MaterialIcon3D name={service.id} accent={service.accent} size={54} />}
        <div>
          <div className="text-[0.68rem] uppercase tracking-[0.22em] text-[color:var(--faint)]">
            {t('projects.service')}
          </div>
          <button
            type="button"
            onClick={() => service && push({ name: 'service', id: service.id })}
            className="text-[0.98rem] font-bold tracking-tight text-[color:var(--text)]"
          >
            {service ? bi(service.title) : '—'}
          </button>
        </div>
      </Reveal>

      <Reveal className="px-5 py-10">
        <h2 className="mb-4 text-[1.1rem] font-bold tracking-tight">{t('projects.context')}</h2>
        <p className="text-[0.9rem] leading-[1.95] text-[color:var(--muted)]">{bi(project.context)}</p>
      </Reveal>

      <Reveal className="border-t border-[color:var(--line)] px-5 py-10">
        <h2 className="mb-5 text-[1.1rem] font-bold tracking-tight">{t('projects.scope')}</h2>
        <ul className="space-y-3">
          {list(project.scope).map((item, i) => (
            <li key={item} className="flex items-baseline gap-3 border-b border-[color:var(--line)] pb-3">
              <span className="font-mono text-[0.65rem] text-[color:var(--primary)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.88rem]">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {project.gallery.length > 0 && (
        <section className="py-4">
          <h2 className="px-5 pb-4 text-[1.1rem] font-bold tracking-tight">{t('projects.gallery')}</h2>
          {project.gallery.map((src, i) => (
            <Reveal key={i} className="mb-4 px-5">
              <div className="h-[22rem] overflow-hidden rounded-[var(--radius-lg)]">
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </section>
      )}

      <Reveal className="px-5 py-8">
        <Button
          block
          icon="arrow"
          onClick={() => push({ name: 'flow', kind: 'service', serviceId: project.serviceId })}
        >
          {t('projects.cta')}
        </Button>
      </Reveal>
    </div>
  );
}

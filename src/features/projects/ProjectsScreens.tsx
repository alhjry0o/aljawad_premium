import { useMemo, useState } from 'react';
import { useProject, useProjects } from '../../core/projectsStore';
import { getService, services } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, Chip, DemoBadge, Reveal, ScreenHeader, useScrollY } from '../../components/kit';

export function ProjectsScreen() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const [filter, setFilter] = useState<string>('all');
  const { projects } = useProjects();

  const usedServices = useMemo(
    () => services.filter((s) => projects.some((p) => p.serviceId === s.id)),
    [projects],
  );
  const visible = filter === 'all' ? projects : projects.filter((p) => p.serviceId === filter);
  
  return (
    <div className="pb-10">
      <ScreenHeader
        title={t('projects.title')}
        subtitle={t('projects.demoNote')}
        trailing={<DemoBadge label={t('common.demo')} />}
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-4">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
          {t('projects.filter.all')}
        </Chip>
        {usedServices.map((s) => (
          <Chip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
            {bi(s.title)}
          </Chip>
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
                className="group relative block w-full overflow-hidden rounded-[var(--radius-lg)] text-start"
                style={{ height: tall ? '27rem' : '19rem' }}
              >
                <img
                  src={project.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/40 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                  <span className="font-mono text-[0.64rem] tracking-[0.22em] text-white/60">
                    {project.code}
                  </span>
                  {service && <MaterialIcon3D name={service.id} accent={service.accent} size={48} />}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-[1.3rem] font-extrabold leading-snug tracking-tight text-white">
                    {bi(project.title)}
                  </h3>
                  <p className="mt-2 max-w-[40ch] text-[0.78rem] leading-relaxed text-white/60">
                    {bi(project.summary)}
                  </p>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="pb-10">
      <section className="relative h-[78svh] overflow-hidden bg-[#030605]">
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * 0.3}px, 0) scale(${1 + p * 0.0005})` }}
        >
          <img src={project.cover} alt="" className="h-full w-full object-cover opacity-80" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/35 to-[#030605]/60" />
        <button
          type="button"
          onClick={back}
          aria-label={t('common.back')}
          className="absolute top-[calc(env(safe-area-inset-top)+1rem)] start-5 z-10 grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] border border-white/15 bg-black/40 text-white backdrop-blur"
        >
          <Glyph name="arrow" size={18} className="ltr:-scale-x-100" />
        </button>
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

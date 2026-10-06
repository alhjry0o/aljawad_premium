import { getService, type ServiceIconKey } from '../../data/services';
import { projects } from '../../data/projects';
import { useI18n } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useTheme } from '../../core/theme';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, DemoBadge, Reveal, useScrollY } from '../../components/kit';

export function ServiceDetailScreen({ id }: { id: ServiceIconKey }) {
  const service = getService(id);
  const { t, bi, list } = useI18n();
  const { push, back } = useNav();
  const { reducedMotion } = useTheme();
  const y = useScrollY();

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
    <div className="pb-8">
      {/* Immersive hero */}
      <section className="relative h-[70svh] overflow-hidden bg-[#030605]">
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${p * 0.3}px, 0) scale(${1 + p * 0.0005})` }}
        >
          <img src={service.image} alt="" className="h-full w-full object-cover opacity-75" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/55 to-[#030605]/70" />
        <button
          type="button"
          onClick={back}
          aria-label={t('common.back')}
          className="absolute top-[calc(env(safe-area-inset-top)+1rem)] start-5 z-10 grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] border border-white/15 bg-black/40 text-white backdrop-blur"
        >
          <Glyph name="arrow" size={18} className="ltr:-scale-x-100" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <MaterialIcon3D name={service.id} accent={service.accent} size={86} className="jw-float" />
          <span className="mt-4 block font-mono text-[0.72rem] tracking-[0.32em] text-white/50">
            {service.number}
          </span>
          <h1 className="mt-2 text-[2rem] font-extrabold leading-[1.15] tracking-tight text-white">
            {bi(service.title)}
          </h1>
          <p className="mt-3 max-w-[40ch] text-[0.9rem] leading-relaxed text-white/65">
            {bi(service.statement)}
          </p>
        </div>
      </section>

      <Reveal className="px-5 py-10">
        <p className="text-[0.92rem] leading-[1.95] text-[color:var(--muted)]">{bi(service.description)}</p>
      </Reveal>

      <Reveal className="border-t border-[color:var(--line)] px-5 py-10">
        <h2 className="mb-6 text-[1.15rem] font-bold tracking-tight">{t('services.includes')}</h2>
        <ul className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {list(service.includes).map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--primary)]" />
              <span className="text-[0.85rem] leading-relaxed text-[color:var(--text)]">{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {related.length > 0 && (
        <Reveal className="border-t border-[color:var(--line)] py-10">
          <div className="mb-5 flex items-center justify-between px-5">
            <h2 className="text-[1.15rem] font-bold tracking-tight">{t('services.related')}</h2>
            <DemoBadge label={t('common.demo')} />
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2">
            {related.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => push({ name: 'project', id: project.id })}
                className="relative h-44 w-64 shrink-0 overflow-hidden rounded-[var(--radius-md)] text-start"
              >
                <img src={project.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030605] to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3.5 text-[0.85rem] font-bold text-white">
                  {bi(project.title)}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="px-5 py-10">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => push({ name: 'flow', kind: 'service', serviceId: service.id })} icon="arrow">
            {t('hero.cta.primary')}
          </Button>
          <Button variant="ghost" onClick={() => push({ name: 'flow', kind: 'quote', serviceId: service.id })}>
            {t('hero.cta.secondary')}
          </Button>
          <Button variant="ghost" onClick={() => push({ name: 'flow', kind: 'inspection', serviceId: service.id })}>
            {t('flow.inspection.title')}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

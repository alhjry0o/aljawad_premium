import { useMemo, useState } from 'react';
import { getService } from '../../data/services';
import type { AppRequest, RequestKind, RequestStatus } from '../../data/requests';
import { useI18n, type TranslationKey } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useRequests } from '../../core/store';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, Chip, DemoBadge, Reveal, ScreenHeader } from '../../components/kit';
import { normalize } from '../../data/services';
import { cn } from '../../utils/cn';

const statusKey = (status: RequestStatus): TranslationKey => `status.${status}` as TranslationKey;
const kindKey = (kind: RequestKind): TranslationKey => `requests.type.${kind}` as TranslationKey;

const STATUS_TONE: Record<RequestStatus, string> = {
  submitted: 'var(--primary)',
  received: 'var(--primary)',
  review: 'var(--accent)',
  awaiting_inspection: 'var(--warning)',
  preparing_quote: 'var(--accent)',
  scheduled: 'var(--accent)',
  in_progress: 'var(--warning)',
  completed: 'var(--success)',
  cancelled: 'var(--error)',
};

function StatusPill({ status }: { status: RequestStatus }) {
  const { t } = useI18n();
  const tone = STATUS_TONE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/5 px-2.5 py-1 text-[0.66rem] font-semibold backdrop-blur-md"
      style={{ color: tone, background: `color-mix(in srgb, ${tone} 14%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone, boxShadow: `0 0 6px ${tone}` }} />
      {t(statusKey(status))}
    </span>
  );
}

function RequestCard({ request, onOpen }: { request: AppRequest; onOpen: () => void }) {
  const { t, bi } = useI18n();
  const service = getService(request.serviceId);
  
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] p-4 text-start shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-2xl transition-all duration-300 active:scale-[0.99] hover:bg-white/[0.05]"
    >
      {service && <MaterialIcon3D name={service.id} accent={service.accent} size={54} />}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-[#5fe0a5]">
            {request.reference}
          </span>
          <span className="text-[0.66rem] text-white/40">· {t(kindKey(request.kind))}</span>
        </span>
        <span className="mt-1 block truncate text-[0.95rem] font-bold tracking-tight text-white/90">
          {service ? bi(service.title) : '—'}
        </span>
        <span className="mt-2 flex items-center gap-2">
          <StatusPill status={request.status} />
          <span className="text-[0.66rem] text-white/30">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </span>
      </span>
      <Glyph name="arrow" size={17} className="shrink-0 text-white/20 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
    </button>
  );
}

export function RequestsScreen() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { requests } = useRequests();
  const [filter, setFilter] = useState<'all' | RequestKind>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalize(query);
    return requests.filter((r) => {
      if (filter !== 'all' && r.kind !== filter) return false;
      if (!q) return true;
      const service = getService(r.serviceId);
      const hay = normalize(
        [r.reference, service ? bi(service.title) : '', r.location.city, r.contact.name].join(' '),
      );
      return hay.includes(q);
    });
  }, [requests, filter, query, bi]);

  const groups = useMemo(() => {
    const map = new Map<string, AppRequest[]>();
    filtered.forEach((r) => {
      const key = new Date(r.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      });
      map.set(key, [...(map.get(key) ?? []), r]);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="pb-32">
      <ScreenHeader
        title={t('requests.title')}
        subtitle={`${requests.length} ${t('requests.count')}`}
      />

      {requests.length === 0 ? (
        <div className="px-6 py-24 text-center">
          <MaterialIcon3D name="receipt" accent="navy" size={104} className="mx-auto jw-float" />
          <h2 className="mt-6 text-[1.2rem] font-bold">{t('requests.empty')}</h2>
          <p className="mx-auto mt-2 max-w-[32ch] text-[0.82rem] leading-relaxed text-[color:var(--muted)]">
            {t('requests.emptyBody')}
          </p>
          <div className="mt-7 flex justify-center">
            <Button onClick={() => push({ name: 'flow', kind: 'service' })} icon="arrow">
              {t('hero.cta.primary')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-5 pt-5">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3.5 backdrop-blur-xl transition-all duration-300 focus-within:border-[color:var(--primary)]/60 focus-within:shadow-[0_0_0_3px_rgba(43,211,140,0.1)]">
              <Glyph name="search" size={17} className="text-[color:var(--faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('requests.search')}
                className="w-full bg-transparent text-[0.85rem] text-white outline-none placeholder:text-[color:var(--faint)]"
              />
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
                {t('requests.all')}
              </Chip>
              {(['service', 'quote', 'inspection'] as RequestKind[]).map((k) => (
                <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>
                  {t(kindKey(k))}
                </Chip>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="px-5 py-16 text-center text-[0.85rem] text-[color:var(--muted)]">
              {t('search.empty')}
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {groups.map(([label, items]) => (
                <section key={label} className="px-5">
                  <h2 className="mb-3 px-1 text-[0.68rem] uppercase tracking-[0.25em] text-[color:var(--faint)]">
                    {label}
                  </h2>
                  <div className="space-y-3">
                    {items.map((r) => (
                      <Reveal key={r.id}>
                        <RequestCard request={r} onOpen={() => push({ name: 'request', id: r.id })} />
                      </Reveal>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
          <p className="px-5 py-8 text-center text-[0.7rem] text-[color:var(--faint)]">{t('requests.localNote')}</p>
        </>
      )}
    </div>
  );
}

const TIMELINE_ORDER: RequestStatus[] = [
  'submitted',
  'received',
  'review',
  'scheduled',
  'in_progress',
  'completed',
];

export function RequestDetailScreen({ id }: { id: string }) {
  const { t, bi } = useI18n();
  const { byId, remove } = useRequests();
  const { back, goTab } = useNav();
  const request = byId(id);

  if (!request) {
    return (
      <div className="px-5 py-24 text-center text-[color:var(--muted)]">
        <ScreenHeader title={t('requests.title')} />
        {t('error.generic')}
      </div>
    );
  }

  const service = getService(request.serviceId);
  const reached = TIMELINE_ORDER.indexOf(request.status);

  return (
    <div className="pb-32">
      <ScreenHeader title={request.reference} subtitle={t(kindKey(request.kind))} />

      <div className="px-5 pt-6">
        <div className="flex items-center gap-4">
          {service && <MaterialIcon3D name={service.id} accent={service.accent} size={72} />}
          <div>
            <h2 className="text-[1.25rem] font-extrabold tracking-tight text-white">
              {service ? bi(service.title) : '—'}
            </h2>
            <div className="mt-2">
              <StatusPill status={request.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline — Neon Line */}
      <section className="mt-8 px-5">
        <h3 className="mb-4 text-[0.98rem] font-bold text-white">{t('requests.timeline')}</h3>
        <ol className="relative ps-6">
          <span className="absolute inset-y-1 start-[7px] w-[2px] bg-white/10" />
          {TIMELINE_ORDER.map((s, i) => {
            const done = i <= Math.max(reached, 0);
            return (
              <li key={s} className="relative pb-6 last:pb-0">
                <span
                  className={cn(
                    'absolute -start-6 top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 transition-all duration-500',
                    done
                      ? 'border-[#2bd38c] bg-[#0a1f24] shadow-[0_0_12px_rgba(43,211,140,0.6)]'
                      : 'border-white/15 bg-transparent',
                  )}
                >
                  {done && <span className="h-1.5 w-1.5 rounded-full bg-[#2bd38c]" />}
                </span>
                <span
                  className={cn(
                    'text-[0.85rem] leading-none transition-colors',
                    done ? 'font-semibold text-white' : 'text-white/40',
                  )}
                >
                  {t(statusKey(s))}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8 px-5">
        <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <Row label={t('step.location')} value={[request.location.city, request.location.district, request.location.address].filter(Boolean).join(' · ')} />
          {request.propertyType && <Row label={t('step.property')} value={t(request.propertyType as TranslationKey)} />}
          {request.schedule?.date && (
            <Row label={t('step.schedule')} value={`${request.schedule.date} ${request.schedule.time ?? ''}`.trim()} />
          )}
          {request.notes && <Row label={t('field.notes')} value={request.notes} />}
          {request.specs &&
            Object.entries(request.specs).map(([k, v]) => <Row key={k} label={k} value={v} />)}
          <Row label={t('field.name')} value={request.contact.name} />
          <Row label={t('field.phone')} value={request.contact.phone} />
        </div>
      </section>

      {request.photos.length > 0 && (
        <section className="px-5 py-7">
          <h3 className="mb-3 text-[0.9rem] font-bold">{t('step.photos')}</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {request.photos.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square rounded-[12px] border border-white/10 object-cover" />
            ))}
          </div>
        </section>
      )}

      <div className="px-5 pt-4">
        <p className="mb-5 text-center text-[0.72rem] text-[color:var(--faint)]">{t('requests.localNote')}</p>
        <Button
          variant="ghost"
          block
          onClick={async () => {
            await remove(request.id);
            back();
            goTab('requests');
          }}
          className="!text-[color:var(--error)] rounded-[14px] border-white/10"
        >
          {t('requests.delete')}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/5 bg-white/[0.015] px-4 py-3.5 last:border-0">
      <span className="text-[0.75rem] text-[color:var(--muted)]">{label}</span>
      <span className="max-w-[62%] text-end text-[0.84rem] font-semibold leading-relaxed text-white/90">{value}</span>
    </div>
  );
}

export function SuccessScreen({ id }: { id: string }) {
  const { t, bi } = useI18n();
  const { byId } = useRequests();
  const { goTab, replace } = useNav();
  const request = byId(id);
  const service = request ? getService(request.serviceId) : undefined;

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[color:var(--bg)] px-6 pb-32 pt-24">
      <div
        className="absolute inset-0 opacity-80"
        style={{ background: 'radial-gradient(80% 50% at 50% 0%, var(--glow), transparent 65%)' }}
      />
      <div className="jw-grid absolute inset-0 opacity-20" />
      <div className="relative text-center">
        <div className="jw-rise mx-auto grid h-24 w-24 place-items-center rounded-full border border-[color:var(--primary)]/40 bg-[color:var(--primary)]/10 shadow-[0_0_40px_-10px_var(--glow)]">
          <Glyph name="check" size={38} className="text-[color:var(--primary)] drop-shadow-[0_0_8px_var(--glow)]" strokeWidth={1.6} />
        </div>
        <h1 className="mt-7 text-[1.6rem] font-extrabold tracking-tight text-white">{t('success.title')}</h1>
        <p className="mx-auto mt-2 max-w-[34ch] text-[0.85rem] leading-relaxed text-[color:var(--muted)]">
          {t('success.body')}
        </p>

        {request && (
          <div className="mt-8 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] text-start shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-2xl">
            <Row label={t('success.number')} value={request.reference} />
            <Row label={t('step.service')} value={service ? bi(service.title) : '—'} />
            <Row
              label={t('step.location')}
              value={[request.location.city, request.location.address].filter(Boolean).join(' · ') || '—'}
            />
            {request.schedule?.date && <Row label={t('field.date')} value={request.schedule.date} />}
          </div>
        )}

        <div className="mt-8 space-y-3">
          {request && (
            <Button block onClick={() => replace({ name: 'request', id: request.id })} className="rounded-[14px] py-4">
              {t('success.view')}
            </Button>
          )}
          <Button variant="ghost" block onClick={() => goTab('requests')} className="rounded-[14px] border-white/10 py-3.5">
            {t('success.requests')}
          </Button>
          <Button variant="quiet" block onClick={() => goTab('home')}>
            {t('success.home')}
          </Button>
        </div>
      </div>
    </div>
  );
}

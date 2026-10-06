import { useMemo, useState } from 'react';
import { getService } from '../../data/services';
import type { AppRequest, RequestKind, RequestStatus } from '../../data/requests';
import { useI18n, type TranslationKey } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useRequests } from '../../core/store';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, Chip, DemoBadge, Reveal, ScreenHeader } from '../../components/kit';
import { normalize } from '../../data/services';

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
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold"
      style={{ color: tone, background: `color-mix(in srgb, ${tone} 14%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
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
      className="group flex w-full items-center gap-4 border-t border-[color:var(--line)] px-5 py-5 text-start transition-colors hover:bg-[color:var(--surface)]"
    >
      {service && <MaterialIcon3D name={service.id} accent={service.accent} size={56} />}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[0.68rem] tracking-[0.18em] text-[color:var(--primary)]">
            {request.reference}
          </span>
          <span className="text-[0.66rem] text-[color:var(--faint)]">· {t(kindKey(request.kind))}</span>
        </span>
        <span className="mt-1 block truncate text-[0.95rem] font-bold tracking-tight">
          {service ? bi(service.title) : '—'}
        </span>
        <span className="mt-2 flex items-center gap-2">
          <StatusPill status={request.status} />
          <span className="text-[0.66rem] text-[color:var(--faint)]">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </span>
      </span>
      <Glyph name="arrow" size={17} className="shrink-0 text-[color:var(--faint)] rtl:-scale-x-100" />
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
    <div className="pb-6">
      <ScreenHeader
        title={t('requests.title')}
        subtitle={`${requests.length} ${t('requests.count')}`}
        trailing={<DemoBadge label={t('common.demo')} />}
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
            <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[color:var(--line)] bg-[color:var(--elevated)] px-4 py-3">
              <Glyph name="search" size={17} className="text-[color:var(--faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('requests.search')}
                className="w-full bg-transparent text-[0.85rem] outline-none placeholder:text-[color:var(--faint)]"
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
            <div className="mt-6">
              {groups.map(([label, items]) => (
                <section key={label}>
                  <h2 className="px-5 pb-2 pt-5 text-[0.68rem] uppercase tracking-[0.25em] text-[color:var(--faint)]">
                    {label}
                  </h2>
                  {items.map((r) => (
                    <Reveal key={r.id}>
                      <RequestCard request={r} onOpen={() => push({ name: 'request', id: r.id })} />
                    </Reveal>
                  ))}
                </section>
              ))}
            </div>
          )}
          <p className="px-5 py-8 text-[0.7rem] text-[color:var(--faint)]">{t('requests.localNote')}</p>
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
    <div className="pb-10">
      <ScreenHeader title={request.reference} subtitle={t(kindKey(request.kind))} />

      <div className="px-5 pt-6">
        <div className="flex items-center gap-4">
          {service && <MaterialIcon3D name={service.id} accent={service.accent} size={72} />}
          <div>
            <h2 className="text-[1.25rem] font-extrabold tracking-tight">
              {service ? bi(service.title) : '—'}
            </h2>
            <div className="mt-2">
              <StatusPill status={request.status} />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 px-5">
        <h3 className="mb-4 text-[0.98rem] font-bold">{t('requests.timeline')}</h3>
        <ol className="relative ps-5">
          <span className="absolute inset-y-1 start-[3px] w-px bg-[color:var(--line)]" />
          {TIMELINE_ORDER.map((s, i) => {
            const done = i <= Math.max(reached, 0);
            return (
              <li key={s} className="relative pb-5 last:pb-0">
                <span
                  className="absolute -start-5 top-1 h-[7px] w-[7px] rounded-full"
                  style={{ background: done ? 'var(--primary)' : 'var(--line-strong)' }}
                />
                <span
                  className="text-[0.82rem]"
                  style={{ color: done ? 'var(--text)' : 'var(--faint)', fontWeight: done ? 600 : 400 }}
                >
                  {t(statusKey(s))}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8 overflow-hidden border-y border-[color:var(--line)]">
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
      </section>

      {request.photos.length > 0 && (
        <section className="px-5 py-7">
          <h3 className="mb-3 text-[0.9rem] font-bold">{t('step.photos')}</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {request.photos.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square rounded-[var(--radius-sm)] object-cover" />
            ))}
          </div>
        </section>
      )}

      <div className="px-5 pt-4">
        <p className="mb-5 text-[0.72rem] text-[color:var(--faint)]">{t('requests.localNote')}</p>
        <Button
          variant="ghost"
          block
          onClick={async () => {
            await remove(request.id);
            back();
            goTab('requests');
          }}
          className="!text-[color:var(--error)]"
        >
          {t('requests.delete')}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-[color:var(--line)] px-5 py-4 last:border-0">
      <span className="text-[0.75rem] text-[color:var(--muted)]">{label}</span>
      <span className="max-w-[62%] text-end text-[0.84rem] font-semibold leading-relaxed">{value}</span>
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
        <div className="jw-rise mx-auto grid h-24 w-24 place-items-center rounded-full border border-[color:var(--primary)]/40 bg-[color:var(--primary)]/10">
          <Glyph name="check" size={38} className="text-[color:var(--primary)]" strokeWidth={1.6} />
        </div>
        <h1 className="mt-7 text-[1.6rem] font-extrabold tracking-tight">{t('success.title')}</h1>
        <p className="mx-auto mt-2 max-w-[34ch] text-[0.85rem] leading-relaxed text-[color:var(--muted)]">
          {t('success.body')}
        </p>

        {request && (
          <div className="mt-8 overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--line)] text-start">
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
            <Button block onClick={() => replace({ name: 'request', id: request.id })}>
              {t('success.view')}
            </Button>
          )}
          <Button variant="ghost" block onClick={() => goTab('requests')}>
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

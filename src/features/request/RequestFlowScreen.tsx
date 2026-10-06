import { useMemo, useState, type ChangeEvent } from 'react';
import { services, type ServiceIconKey } from '../../data/services';
import type { RequestKind } from '../../data/requests';
import { useI18n, type TranslationKey } from '../../core/i18n';
import { useNav } from '../../core/navigation';
import { useRequests } from '../../core/store';
import { Glyph, MaterialIcon3D } from '../../components/icons';
import { Button, OptionGrid, ScreenHeader, TextArea, TextField, Label } from '../../components/kit';
import { cn } from '../../utils/cn';

type StepId = 'service' | 'property' | 'specs' | 'location' | 'schedule' | 'details' | 'photos' | 'contact' | 'review';

const STEPS: Record<RequestKind, StepId[]> = {
  service: ['service', 'property', 'location', 'schedule', 'details', 'photos', 'contact', 'review'],
  quote: ['service', 'specs', 'location', 'photos', 'contact', 'review'],
  inspection: ['service', 'location', 'schedule', 'details', 'photos', 'contact', 'review'],
};

const STEP_TITLE: Record<StepId, TranslationKey> = {
  service: 'step.service',
  property: 'step.property',
  specs: 'step.specs',
  location: 'step.location',
  schedule: 'step.schedule',
  details: 'step.details',
  photos: 'step.photos',
  contact: 'step.contact',
  review: 'step.review',
};

const PROPERTY_KEYS: TranslationKey[] = [
  'property.home',
  'property.villa',
  'property.palace',
  'property.office',
  'property.hotel',
  'property.hospital',
  'property.factory',
  'property.warehouse',
  'property.building',
  'property.parking',
  'property.other',
];

interface FormState {
  serviceId?: ServiceIconKey;
  propertyType?: string;
  city: string;
  district: string;
  address: string;
  extra: string;
  date: string;
  time: string;
  notes: string;
  name: string;
  phone: string;
  photos: string[];
  specs: Record<string, string>;
}

const initialState: FormState = {
  city: '',
  district: '',
  address: '',
  extra: '',
  date: '',
  time: '',
  notes: '',
  name: '',
  phone: '',
  photos: [],
  specs: {},
};

/** Compress an image to a small data URL so local storage stays healthy. */
const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read-failed'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 700;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = () => resolve(String(reader.result));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

export function RequestFlowScreen({ kind, serviceId }: { kind: RequestKind; serviceId?: ServiceIconKey }) {
  const { t, bi } = useI18n();
  const { push, back } = useNav();
  const { create } = useRequests();
  const [index, setIndex] = useState(serviceId ? 1 : 0);
  const [form, setForm] = useState<FormState>({ ...initialState, serviceId });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const steps = STEPS[kind];
  const step = steps[index];
  const titleKey: TranslationKey =
    kind === 'service' ? 'flow.service.title' : kind === 'quote' ? 'flow.quote.title' : 'flow.inspection.title';

  const selected = useMemo(() => services.find((s) => s.id === form.serviceId), [form.serviceId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 'service' && !form.serviceId) e.service = t('error.selectService');
    if (step === 'property' && !form.propertyType) e.property = t('error.required');
    if (step === 'location') {
      if (!form.city.trim()) e.city = t('error.required');
      if (!form.address.trim()) e.address = t('error.required');
    }
    if (step === 'schedule') {
      if (!form.date) e.date = t('error.required');
    }
    if (step === 'contact') {
      if (form.name.trim().length < 2) e.name = t('error.name');
      if (!/^[0-9+\s-]{8,16}$/.test(form.phone.trim())) e.phone = t('error.phone');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (index < steps.length - 1) {
      setIndex(index + 1);
      window.scrollTo({ top: 0 });
    }
  };

  const prev = () => {
    if (index === 0) back();
    else setIndex(index - 1);
  };

  const submit = async () => {
    if (!form.serviceId) return;
    setSubmitting(true);
    const created = await create({
      kind,
      serviceId: form.serviceId,
      propertyType: form.propertyType,
      location: { city: form.city, district: form.district, address: form.address, extra: form.extra },
      schedule: form.date ? { date: form.date, time: form.time } : undefined,
      notes: form.notes,
      photos: form.photos,
      contact: { name: form.name.trim(), phone: form.phone.trim() },
      specs: Object.keys(form.specs).length ? form.specs : undefined,
    });
    setSubmitting(false);
    push({ name: 'success', id: created.id });
  };

  const onPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4);
    const urls = await Promise.all(files.map(toDataUrl));
    set('photos', [...form.photos, ...urls].slice(0, 6));
  };

  const specFields = useMemo(() => {
    const base: { key: string; label: string; options?: { value: string; label: string }[] }[] = [];
    if (form.serviceId === 'facade') {
      base.push(
        { key: 'facadeType', label: t('field.facadeType') },
        { key: 'floors', label: t('field.floors') },
        { key: 'area', label: t('field.area') },
        {
          key: 'side',
          label: t('field.side'),
          options: [
            { value: 'inside', label: t('option.inside') },
            { value: 'outside', label: t('option.outside') },
            { value: 'both', label: t('option.both') },
          ],
        },
      );
    } else {
      base.push({ key: 'units', label: t('field.units') }, { key: 'area', label: t('field.area') });
    }
    base.push({
      key: 'frequency',
      label: t('field.frequency'),
      options: [
        { value: 'once', label: t('option.once') },
        { value: 'weekly', label: t('option.weekly') },
        { value: 'monthly', label: t('option.monthly') },
        { value: 'annual', label: t('option.annual') },
      ],
    });
    return base;
  }, [form.serviceId, t]);

  return (
    <div className="pb-40">
      <ScreenHeader title={t(titleKey)} subtitle={`${t('flow.step')} ${index + 1} ${t('flow.of')} ${steps.length}`} />

      {/* progress */}
      <div className="sticky top-[4.1rem] z-20 flex gap-1.5 bg-[color:var(--bg)]/90 px-5 py-3 backdrop-blur">
        {steps.map((s, i) => (
          <span
            key={s}
            className={cn(
              'h-[3px] flex-1 rounded-full transition-colors duration-500',
              i < index ? 'bg-[color:var(--primary)]/55' : i === index ? 'bg-[color:var(--primary)]' : 'bg-[color:var(--line)]',
            )}
          />
        ))}
      </div>

      <div className="px-5 pt-6">
        <span className="font-mono text-[0.65rem] tracking-[0.3em] text-[color:var(--primary)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="mt-1.5 text-[1.4rem] font-extrabold tracking-tight">{t(STEP_TITLE[step])}</h2>
      </div>

      <div className="space-y-5 px-5 pt-7">
        {step === 'service' && (
          <>
            <div className="grid gap-2.5">
              {services.map((s) => {
                const active = form.serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set('serviceId', s.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-[var(--radius-sm)] border px-3 py-3 text-start transition-all',
                      active
                        ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/10'
                        : 'border-[color:var(--line)] bg-[color:var(--elevated)]',
                    )}
                  >
                    <MaterialIcon3D name={s.id} accent={s.accent} size={46} />
                    <span className="flex-1 text-[0.9rem] font-semibold">{bi(s.title)}</span>
                    <span className="font-mono text-[0.62rem] text-[color:var(--faint)]">{s.number}</span>
                  </button>
                );
              })}
            </div>
            {errors.service && <p className="text-[0.75rem] text-[color:var(--error)]">{errors.service}</p>}
          </>
        )}

        {step === 'property' && (
          <>
            <OptionGrid
              options={PROPERTY_KEYS.map((k) => ({ value: k, label: t(k) }))}
              value={form.propertyType}
              onChange={(v) => set('propertyType', v)}
            />
            {errors.property && <p className="text-[0.75rem] text-[color:var(--error)]">{errors.property}</p>}
          </>
        )}

        {step === 'specs' &&
          specFields.map((field) =>
            field.options ? (
              <div key={field.key}>
                <Label>{field.label}</Label>
                <OptionGrid
                  options={field.options}
                  value={form.specs[field.key]}
                  onChange={(v) => set('specs', { ...form.specs, [field.key]: v })}
                />
              </div>
            ) : (
              <TextField
                key={field.key}
                label={field.label}
                value={form.specs[field.key] ?? ''}
                onChange={(e) => set('specs', { ...form.specs, [field.key]: e.target.value })}
              />
            ),
          )}

        {step === 'location' && (
          <>
            <TextField
              label={t('field.city')}
              value={form.city}
              error={errors.city}
              onChange={(e) => set('city', e.target.value)}
            />
            <TextField
              label={t('field.district')}
              hint={t('field.optional')}
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
            />
            <TextField
              label={t('field.address')}
              value={form.address}
              error={errors.address}
              onChange={(e) => set('address', e.target.value)}
            />
            <TextArea
              label={t('field.extra')}
              hint={t('field.optional')}
              rows={3}
              value={form.extra}
              onChange={(e) => set('extra', e.target.value)}
            />
          </>
        )}

        {step === 'schedule' && (
          <>
            <TextField
              label={t('field.date')}
              type="date"
              value={form.date}
              error={errors.date}
              onChange={(e) => set('date', e.target.value)}
            />
            <TextField
              label={t('field.time')}
              type="time"
              hint={t('field.optional')}
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
            />
          </>
        )}

        {step === 'details' && (
          <TextArea
            label={t('field.notes')}
            hint={t('field.optional')}
            rows={6}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        )}

        {step === 'photos' && (
          <div>
            <Label hint={t('field.optional')}>{t('field.photos')}</Label>
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--elevated)] px-5 py-9 text-center">
              <Glyph name="camera" size={26} className="text-[color:var(--primary)]" />
              <span className="text-[0.82rem] font-semibold">{t('field.photos')}</span>
              <span className="text-[0.7rem] text-[color:var(--faint)]">{t('field.photosHint')}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPhotos} />
            </label>
            {form.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {form.photos.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)]">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}
                      aria-label={t('search.clear')}
                      className="absolute end-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white"
                    >
                      <Glyph name="close" size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'contact' && (
          <>
            <TextField
              label={t('field.name')}
              value={form.name}
              error={errors.name}
              onChange={(e) => set('name', e.target.value)}
            />
            <TextField
              label={t('field.phone')}
              type="tel"
              inputMode="tel"
              dir="ltr"
              value={form.phone}
              error={errors.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </>
        )}

        {step === 'review' && (
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--line)]">
            <ReviewRow label={t('step.service')} value={selected ? bi(selected.title) : '—'} />
            {form.propertyType && <ReviewRow label={t('step.property')} value={t(form.propertyType as TranslationKey)} />}
            <ReviewRow
              label={t('step.location')}
              value={[form.city, form.district, form.address].filter(Boolean).join(' · ') || '—'}
            />
            {form.date && <ReviewRow label={t('step.schedule')} value={`${form.date} ${form.time}`.trim()} />}
            {form.notes && <ReviewRow label={t('field.notes')} value={form.notes} />}
            {Object.entries(form.specs).map(([k, v]) => (
              <ReviewRow key={k} label={k} value={v} />
            ))}
            <ReviewRow label={t('field.name')} value={form.name || '—'} />
            <ReviewRow label={t('field.phone')} value={form.phone || '—'} />
            <ReviewRow label={t('step.photos')} value={String(form.photos.length)} />
          </div>
        )}
      </div>

      {/* Sticky actions */}
      <div className="fixed inset-x-0 bottom-[5.5rem] z-30 px-5">
        <div className="flex gap-3 rounded-[var(--radius-md)] border border-[color:var(--line)] bg-[color:var(--elevated)]/95 p-2.5 backdrop-blur-xl">
          <Button variant="ghost" onClick={prev} className="flex-1">
            {index === 0 ? t('flow.cancel') : t('flow.back')}
          </Button>
          {step === 'review' ? (
            <Button onClick={submit} disabled={submitting} className="flex-[1.6]">
              {t('flow.submit')}
            </Button>
          ) : (
            <Button onClick={next} className="flex-[1.6]" icon="arrow">
              {t('flow.next')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] bg-[color:var(--elevated)] px-4 py-3.5 last:border-0">
      <span className="text-[0.75rem] text-[color:var(--muted)]">{label}</span>
      <span className="max-w-[60%] text-end text-[0.82rem] font-semibold">{value}</span>
    </div>
  );
}

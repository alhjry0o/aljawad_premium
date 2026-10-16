import { useState } from 'react';
import { createPortal } from 'react-dom';
import { appAssets } from '../../data/company';
import { useCompany } from '../../core/companyStore';
import { services } from '../../data/services';
import { useI18n } from '../../core/i18n';
import { useNav, type Route } from '../../core/navigation';
import { useTheme, type ThemeMode } from '../../core/theme';
import { useRequests } from '../../core/store';
import { externalActions } from '../../core/actions';
import { BrandMark, Glyph, MaterialIcon3D, type GlyphName } from '../../components/icons';
import {
  Button,
  DemoBadge,
  Divider,
  Reveal,
  ScreenHeader,
  TextArea,
  TextField,
  Toast,
} from '../../components/kit';
import { cn } from '../../utils/cn';
import { BrandFooter } from '../home/HomeScreen';

/* ------------------------------------------------------------ More hub */

function HubRow({
  icon,
  label,
  meta,
  onClick,
}: {
  icon: GlyphName;
  label: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-start transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)] shadow-[0_0_18px_-8px_var(--glow)]"
      >
        <Glyph name={icon} size={17} strokeWidth={1.9} />
      </span>
      <span className="flex-1 text-[0.9rem] font-semibold">{label}</span>
      {meta && <span className="text-[0.72rem] text-[color:var(--faint)]">{meta}</span>}
      <Glyph name="arrow" size={14} className="shrink-0 text-white/25 rtl:-scale-x-100" />
    </button>
  );
}

/* ------------------------------------------------------------ Language Sheet */

const LANGUAGES = [
  { code: 'ar' as const, name: 'العربية', native: 'Arabic' },
  { code: 'en' as const, name: 'English', native: 'English' },
];

function LanguageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setLang, bi } = useI18n();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-t-[28px] border-t border-white/10 bg-[color:var(--elevated)]/95 backdrop-blur-2xl pb-[max(env(safe-area-inset-bottom),1rem)] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-2 mt-3 h-1 w-10 rounded-full bg-white/15" />

        <div className="px-5 pb-3 pt-2">
          <h3 className="text-[0.95rem] font-bold tracking-tight text-[color:var(--primary)]">
            {bi({ ar: 'اللغة', en: 'Language' })}
          </h3>
        </div>

        <ul>
          {LANGUAGES.map((l, idx) => {
            const active = lang === l.code;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(l.code);
                    window.setTimeout(onClose, 120);
                  }}
                  className="flex w-full items-center gap-4 px-5 py-4 text-start transition-colors active:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        'text-[1rem] font-semibold transition-colors',
                        active ? 'text-[color:var(--text)]' : 'text-white/75',
                      )}
                    >
                      {l.name}
                    </div>
                    <div className="mt-0.5 text-[0.75rem] text-white/40">{l.native}</div>
                  </div>

                  <span
                    className={cn(
                      'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all',
                      active
                        ? 'border-[color:var(--accent)] bg-[color:var(--accent)]'
                        : 'border-white/25',
                    )}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>

                {idx < LANGUAGES.length - 1 && <div className="mx-5 h-px bg-white/8" />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

function LanguageRow() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-start transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)] shadow-[0_0_18px_-8px_var(--glow)]">
          <Glyph name="globe" size={17} strokeWidth={1.9} />
        </span>
        <span className="flex-1 text-[0.9rem] font-semibold">{t('more.languages')}</span>
        <Glyph name="arrow" size={14} className="shrink-0 text-white/25 rtl:-scale-x-100" />
      </button>

      <LanguageSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ShareAppRow() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();
  const [toast, setToast] = useState<string | null>(null);

  const handleShare = async () => {
    const result = await externalActions.share({
      title: bi(appConfig.appName),
      text: appConfig.shareMessage,
      url: appConfig.shareUrl,
      fallbackWhatsapp: appConfig.contact.whatsapp,
    });

    if (result === 'copied') {
      setToast(bi({ ar: 'تم نسخ الرابط', en: 'Link copied' }));
      window.setTimeout(() => setToast(null), 2200);
    } else if (result === 'failed') {
      setToast(bi({ ar: 'تعذّرت المشاركة', en: 'Sharing failed' }));
      window.setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className="group flex w-full items-center gap-3.5 px-4 py-3.5 text-start transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)] shadow-[0_0_18px_-8px_var(--glow)]">
          <Glyph name="share" size={17} strokeWidth={1.9} />
        </span>
        <span className="flex-1 text-[0.9rem] font-semibold">{t('more.share')}</span>
        <Glyph name="arrow" size={14} className="shrink-0 text-white/25 rtl:-scale-x-100" />
      </button>
      {toast && <Toast message={toast} />}
    </>
  );
}

function RateAppRow() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();
  const published = appConfig.playStorePublished;

  const handleClick = () => {
    if (published) {
      externalActions.openUrl(appConfig.shareUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!published}
      className={cn(
        'group flex w-full items-center gap-3.5 px-4 py-3.5 text-start transition-colors',
        published ? 'hover:bg-white/[0.03] active:bg-white/[0.05]' : 'cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border transition-colors',
          published
            ? 'border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)] shadow-[0_0_18px_-8px_var(--glow)]'
            : 'border-white/10 bg-white/[0.03] text-[color:var(--faint)]',
        )}
      >
        <Glyph name="star" size={17} strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'text-[0.9rem] font-semibold',
            published ? 'text-[color:var(--text)]' : 'text-[color:var(--muted)]',
          )}
        >
          {t('more.rate')}
        </div>
        {!published && (
          <div className="mt-0.5 text-[0.68rem] leading-snug text-[color:var(--faint)]">
            {bi({
              ar: 'متاح عند رفع التطبيق على Google Play',
              en: 'Available once published on Google Play',
            })}
          </div>
        )}
      </div>
      {published && (
        <Glyph name="arrow" size={14} className="shrink-0 text-white/25 rtl:-scale-x-100" />
      )}
    </button>
  );
}

export function MoreScreen() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { config: appConfig } = useCompany();

  const go = (route: Route) => () => push(route);

  return (
    <div className="pb-32">
      <ScreenHeader title={t('more.title')} />

      {/* ============ Header with glow ============ */}
      <Reveal className="relative overflow-hidden px-5 py-10">
        <div
          className="pointer-events-none absolute -top-24 start-1/4 h-56 w-56 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 end-1/3 h-44 w-44 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #0d1f3f, transparent 70%)' }}
        />

        <div className="relative flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-70 blur-2xl"
              style={{ background: 'radial-gradient(circle, #2bd38c, transparent 70%)' }}
            />
            <BrandMark size={58} className="drop-shadow-[0_14px_36px_rgba(43,211,140,0.4)]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[1.1rem] font-extrabold leading-tight tracking-tight">
              {bi(appConfig.companyName)}
            </h2>
            <p className="mt-1 truncate text-[0.74rem] text-[color:var(--muted)]">
              {appConfig.contact.website}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ============ Sections ============ */}
      <Section title={t('more.company')}>
        <HubRow icon="layers" label={t('about.title')} onClick={go({ name: 'about' })} />
        <HubRow icon="phone" label={t('contact.title')} onClick={go({ name: 'contact' })} />
        <HubRow
          icon="globe"
          label={t('more.website')}
          onClick={() => externalActions.website(appConfig.contact.website)}
        />
      </Section>

      <Section title={t('more.app')}>
        <HubRow icon="settings" label={t('more.settings')} onClick={go({ name: 'settings' })} />
        <LanguageRow />
        <HubRow
          icon="inspect"
          label={bi({ ar: 'الأسئلة الشائعة', en: 'FAQ' })}
          onClick={go({ name: 'faq' })}
        />
        <ShareAppRow />
        <RateAppRow />
        <HubRow icon="shield" label={t('more.privacy')} onClick={go({ name: 'privacy' })} />
        <HubRow icon="quote" label={t('more.terms')} onClick={go({ name: 'terms' })} />
        <HubRow
          icon="info"
          label={t('more.appInfo')}
          meta={appConfig.version}
          onClick={go({ name: 'settings' })}
        />
      </Section>

      <Section title={t('more.developer')}>
        <HubRow icon="user" label={t('dev.title')} onClick={go({ name: 'developer' })} />
      </Section>

      <BrandFooter />
    </div>
  );
}

/* ============ Section — Glass Container ============ */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 px-5">
      <h3 className="mb-2.5 px-1 text-[0.64rem] uppercase tracking-[0.28em] text-[color:var(--faint)]">
        {title}
      </h3>
      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-2xl">
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ About */

export function AboutScreen() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();
  return (
    <div className="pb-32">
      <ScreenHeader title={t('about.title')} />
      <section className="relative h-[52svh] overflow-hidden bg-[#030605]">
        <img src={appAssets.aboutVisual} alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="text-[0.66rem] uppercase tracking-[0.28em] text-[#5fe0a5]">
            {t('about.kicker')}
          </span>
          <h1 className="mt-3 text-[1.9rem] font-extrabold leading-tight tracking-tight text-white">
            {bi(appConfig.companyName)}
          </h1>
        </div>
      </section>

      <Reveal className="space-y-5 px-5 py-10">
        <p className="text-[0.95rem] leading-[2] text-[color:var(--text)]">{t('about.p1')}</p>
        <p className="text-[0.9rem] leading-[2] text-[color:var(--muted)]">{t('about.p2')}</p>
      </Reveal>

      <Reveal className="px-5 py-4">
        <h2 className="mb-4 px-1 text-[1.05rem] font-bold tracking-tight">{t('about.scope')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl"
            >
              <MaterialIcon3D name={s.id} accent={s.accent} size={40} />
              <span className="text-[0.76rem] font-semibold leading-snug">{bi(s.title)}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <BrandFooter />
    </div>
  );
}

/* ------------------------------------------------------------ Contact */

export function ContactScreen() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();
  const c = appConfig.contact;
  const [toast, setToast] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const flash = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2400);
  };

  const methods: { icon: GlyphName; label: string; value: string; run: () => void }[] = [
    { icon: 'phone', label: t('contact.phone'), value: c.phone, run: () => externalActions.call(c.phone) },
    { icon: 'phone', label: t('contact.mobile'), value: c.mobile1, run: () => externalActions.call(c.mobile1) },
    { icon: 'phone', label: t('contact.mobile'), value: c.mobile2, run: () => externalActions.call(c.mobile2) },
    {
      icon: 'whatsapp',
      label: t('contact.whatsapp'),
      value: c.whatsapp,
      run: () => externalActions.whatsapp(c.whatsapp),
    },
    { icon: 'mail', label: t('contact.email'), value: c.email, run: () => externalActions.email(c.email) },
  ];

  return (
    <div className="pb-32">
      <ScreenHeader title={t('contact.title')} />
      <section className="relative h-[42svh] overflow-hidden bg-[#030605]">
        <img src={appAssets.contactVisual} alt="" className="h-full w-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030605] via-[#030605]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="text-[0.66rem] uppercase tracking-[0.28em] text-[#5fe0a5]">
            {t('contact.kicker')}
          </span>
          <h1 className="mt-2 text-[1.7rem] font-extrabold tracking-tight text-white">{t('contact.title')}</h1>
        </div>
      </section>

      <div className="px-5 pt-6">
        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          {methods.map((m) => (
            <div
              key={`${m.label}-${m.value}`}
              className="flex items-center gap-3.5 border-b border-white/8 px-4 py-3.5 last:border-0"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[color:var(--primary)]/25 bg-[color:var(--primary)]/8 text-[color:var(--primary)]">
                <Glyph name={m.icon} size={16} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[0.68rem] text-[color:var(--faint)]">{m.label}</div>
                <div dir="ltr" className="truncate text-start text-[0.86rem] font-semibold">
                  {m.value}
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const ok = await externalActions.copy(m.value);
                  flash(ok ? t('contact.copied') : t('contact.unavailable'));
                }}
                className="rounded-full border border-white/10 px-2.5 py-1.5 text-[0.66rem] text-[color:var(--muted)]"
              >
                ⧉
              </button>
              <button
                type="button"
                onClick={m.run}
                className="rounded-full bg-[color:var(--primary)]/12 px-3 py-1.5 text-[0.7rem] font-semibold text-[color:var(--primary)]"
              >
                {m.icon === 'mail' ? t('contact.email') : m.icon === 'whatsapp' ? t('quick.whatsapp') : t('quick.call')}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Reveal className="px-5 py-8">
        <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-2xl">
          <div className="jw-grid absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="flex items-start gap-3">
              <Glyph name="pin" size={20} className="mt-0.5 text-[color:var(--primary)]" />
              <div>
                <div className="text-[0.68rem] text-[color:var(--faint)]">{t('contact.address')}</div>
                <p className="mt-1 text-[0.9rem] font-semibold">{bi(c.address)}</p>
              </div>
            </div>
            <div className="mt-5">
              <Button variant="secondary" onClick={() => externalActions.maps(c.mapsQuery)} icon="arrow">
                {t('contact.map')}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="space-y-4 px-5 pb-10">
        <h2 className="text-[1.05rem] font-bold tracking-tight">{t('contact.form')}</h2>
        <TextField label={t('field.name')} value={name} onChange={(e) => setName(e.target.value)} />
        <TextArea
          label={t('contact.message')}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          block
          disabled={!message.trim()}
          onClick={() => {
            setMessage('');
            setName('');
            flash(t('contact.saved'));
          }}
        >
          {t('contact.send')}
        </Button>
        <p className="text-[0.7rem] text-[color:var(--faint)]">{t('requests.localNote')}</p>
      </Reveal>

      <Toast message={toast} />
    </div>
  );
}

/* ------------------------------------------------------------ Settings */

export function SettingsScreen() {
  const { t } = useI18n();
  const { mode, setMode, reducedMotion, setReducedMotion } = useTheme();
  const { clear } = useRequests();
  const { config: appConfig } = useCompany();
  const [toast, setToast] = useState<string | null>(null);

  const modes: { value: ThemeMode; label: string; icon: GlyphName }[] = [
    { value: 'system', label: t('settings.theme.system'), icon: 'spark' },
    { value: 'light', label: t('settings.theme.light'), icon: 'sun' },
    { value: 'dark', label: t('settings.theme.dark'), icon: 'moon' },
  ];

  return (
    <div className="pb-32">
      <ScreenHeader title={t('settings.title')} />

      <Section title={t('settings.appearance')}>
        <div className="grid grid-cols-3 gap-2 p-3">
          {modes.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={mode === m.value}
              className={cn(
                'flex flex-col items-center gap-2 rounded-[14px] border px-2 py-4 transition-all',
                mode === m.value
                  ? 'border-[color:var(--primary)]/40 bg-[color:var(--primary)]/10 text-[color:var(--primary)] shadow-[inset_0_0_0_1px_rgba(43,211,140,0.15)]'
                  : 'border-white/8 bg-white/[0.02] text-[color:var(--muted)]',
              )}
            >
              <Glyph name={m.icon} size={19} />
              <span className="text-[0.74rem] font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title={t('settings.motion')}>
        <label className="flex items-center justify-between gap-4 px-4 py-4">
          <span>
            <span className="block text-[0.88rem] font-semibold">{t('settings.motion')}</span>
            <span className="mt-0.5 block text-[0.72rem] text-[color:var(--muted)]">
              {t('settings.motionHint')}
            </span>
          </span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className="h-5 w-5 accent-[color:var(--primary)]"
          />
        </label>
        <div className="mx-4 h-px bg-white/8" />
        <div className="px-4 py-4">
          <span className="block text-[0.88rem] font-semibold">{t('settings.notifications')}</span>
          <span className="mt-0.5 block text-[0.72rem] text-[color:var(--muted)]">
            {t('settings.notificationsHint')}
          </span>
        </div>
      </Section>

      <Section title={t('settings.data')}>
        <div className="p-3">
          <Button
            variant="ghost"
            block
            onClick={async () => {
              await clear();
              setToast(t('settings.cleared'));
              window.setTimeout(() => setToast(null), 2200);
            }}
            className="!text-[color:var(--error)]"
          >
            {t('settings.clear')}
          </Button>
        </div>
      </Section>

      <Section title={t('more.appInfo')}>
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-[0.85rem]">{t('settings.version')}</span>
          <span className="font-mono text-[0.78rem] text-[color:var(--muted)]">{appConfig.version}</span>
        </div>
      </Section>

      <Toast message={toast} />
    </div>
  );
}

/* ------------------------------------------------------------ Legal */

export function LegalScreen({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useI18n();
  const title = kind === 'privacy' ? t('legal.privacy.title') : t('legal.terms.title');
  const body = kind === 'privacy' ? t('legal.privacy.body') : t('legal.terms.body');
  return (
    <div className="pb-32">
      <ScreenHeader title={title} />
      <div className="px-5 py-8">
        <DemoBadge label={t('legal.placeholder')} />
        <h1 className="mt-6 text-[1.5rem] font-extrabold tracking-tight">{title}</h1>
        <p className="mt-5 text-[0.9rem] leading-[2] text-[color:var(--muted)]">{body}</p>
        <div className="mt-8 space-y-4 border-t border-[color:var(--line)] pt-6 text-[0.85rem] leading-[1.95] text-[color:var(--muted)]">
          <p>{t('legal.placeholder')}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ FAQ */

const FAQS: { q: { ar: string; en: string }; a: { ar: string; en: string } }[] = [
  {
    q: { ar: 'كيف أطلب خدمة من الجواد؟', en: 'How do I request a service from Aljawad?' },
    a: {
      ar: 'يمكنك طلب الخدمة عبر التطبيق مباشرة (زر "اطلب خدمة")، أو التواصل معنا عبر واتساب أو الاتصال على الرقم الموحد. سنرد عليك خلال وقت قصير لتأكيد التفاصيل.',
      en: 'You can request a service directly through the app (the "Request Service" button), or reach us via WhatsApp or call our unified number. We will respond shortly to confirm the details.',
    },
  },
  {
    q: { ar: 'هل المعاينة مجانية؟', en: 'Is the inspection free?' },
    a: {
      ar: 'نعم، المعاينة الأولية مجانية لمعظم الخدمات داخل نطاق خدمتنا. يمكنك طلب معاينة من الشاشة الرئيسية أو من صفحة الخدمة.',
      en: 'Yes, the initial inspection is free for most services within our coverage area. You can request an inspection from the home screen or any service page.',
    },
  },
  {
    q: { ar: 'ما هي المناطق التي تخدمونها؟', en: 'Which areas do you serve?' },
    a: {
      ar: 'نخدم مدينة الرياض وجميع ضواحيها، وأغلب محافظات المملكة. للمشاريع الكبيرة والمنشآت الصناعية، يمكننا التوسع لأي منطقة — تواصل معنا لمناقشة التفاصيل.',
      en: 'We serve Riyadh and all its suburbs, along with most governorates of the Kingdom. For large projects and industrial facilities, we can expand to any area — contact us to discuss the details.',
    },
  },
  {
    q: { ar: 'كم تستغرق الاستجابة للطلب؟', en: 'How long does it take to respond to a request?' },
    a: {
      ar: 'نستجيب عادة خلال أقل من ساعة في ساعات العمل الرسمية. للحالات الطارئة، يمكنك الاتصال بنا مباشرة على الرقم الموحد.',
      en: 'We typically respond in less than an hour during official working hours. For urgent cases, you can call us directly on the unified number.',
    },
  },
  {
    q: { ar: 'هل تستخدمون مواد آمنة؟', en: 'Do you use safe materials?' },
    a: {
      ar: 'نعم، نستخدم مواد معتمدة وصديقة للبيئة من موردين موثوقين، ونلتزم بأعلى معايير السلامة والجودة في جميع خدماتنا.',
      en: 'Yes, we use certified, eco-friendly materials from trusted suppliers, and adhere to the highest safety and quality standards across all our services.',
    },
  },
  {
    q: { ar: 'كيف يتم الدفع؟', en: 'How is payment made?' },
    a: {
      ar: 'نقبل الدفع نقدًا أو عبر التحويل البنكي. للمشاريع الكبيرة والعقود، يمكننا مناقشة خيارات دفع مرنة.',
      en: 'We accept cash or bank transfer. For large projects and contracts, we can discuss flexible payment options.',
    },
  },
  {
    q: { ar: 'هل تقدمون ضمانًا على الخدمة؟', en: 'Do you offer a service warranty?' },
    a: {
      ar: 'نعم، نقدم ضمان جودة على جميع خدماتنا. إذا لم تكن راضيًا، تواصل معنا خلال 7 أيام وسنعالج الأمر فورًا.',
      en: 'Yes, we offer a quality warranty on all our services. If you are not satisfied, contact us within 7 days and we will address it immediately.',
    },
  },
  {
    q: { ar: 'هل يمكنني إلغاء أو تأجيل الموعد؟', en: 'Can I cancel or reschedule an appointment?' },
    a: {
      ar: 'نعم، يمكنك الإلغاء أو التأجيل قبل 24 ساعة من الموعد دون أي رسوم. تواصل معنا عبر واتساب أو الهاتف لإجراء التعديل.',
      en: 'Yes, you can cancel or reschedule up to 24 hours before the appointment at no charge. Contact us via WhatsApp or phone to make the change.',
    },
  },
];

export function FaqScreen() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="pb-32">
      <ScreenHeader
        title={bi({ ar: 'الأسئلة الشائعة', en: 'FAQ' })}
        subtitle={bi({ ar: 'إجابات على أكثر ما يسأل عنه عملاؤنا', en: 'Answers to our most common questions' })}
      />

      <div className="px-5 pt-6">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-4 backdrop-blur-2xl">
          <p className="text-[0.85rem] leading-relaxed text-[color:var(--muted)]">
            {bi({
              ar: 'جمعنا لك أكثر الأسئلة تكرارًا وإجاباتها. إذا لم تجد ما تبحث عنه، تواصل معنا مباشرة في نهاية الصفحة.',
              en: 'We have gathered the most frequent questions and their answers. If you do not find what you are looking for, contact us directly at the end of the page.',
            })}
          </p>
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          {FAQS.map((item, i) => {
            const open = openId === i;
            return (
              <div key={i} className="border-b border-white/8 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-4 py-4 text-start transition-colors hover:bg-white/[0.03]"
                >
                  <span
                    className={cn(
                      'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300',
                      open
                        ? 'border-[color:var(--primary)]/40 bg-[color:var(--primary)]/15 text-[color:var(--primary)]'
                        : 'border-white/15 text-[color:var(--muted)]',
                    )}
                  >
                    <Glyph
                      name="close"
                      size={14}
                      className={cn('transition-transform duration-300', !open && 'rotate-45')}
                    />
                  </span>
                  <span
                    className={cn(
                      'flex-1 text-[0.9rem] font-semibold leading-snug tracking-tight transition-colors',
                      open ? 'text-[color:var(--primary)]' : 'text-[color:var(--text)]',
                    )}
                  >
                    {bi(item.q)}
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="min-h-0">
                    <div className="px-4 pb-5 ps-[52px]">
                      <p className="text-[0.83rem] leading-[1.95] text-[color:var(--muted)]">
                        {bi(item.a)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Reveal className="px-5 pt-8">
        <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-2xl">
          <div className="jw-grid absolute inset-0 opacity-30" />
          <div className="relative">
            <h3 className="text-[1.05rem] font-bold tracking-tight">
              {bi({ ar: 'لم تجد إجابتك؟', en: "Didn't find your answer?" })}
            </h3>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-[color:var(--muted)]">
              {bi({
                ar: 'فريقنا جاهز للإجابة على جميع استفساراتك.',
                en: 'Our team is ready to answer all your questions.',
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => externalActions.whatsapp(appConfig.contact.whatsapp)}
                icon="whatsapp"
              >
                {t('quick.whatsapp')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => externalActions.call(appConfig.contact.phone)}
                icon="phone"
              >
                {t('quick.call')}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------ Developer */

export function DeveloperScreen() {
  const { t, bi } = useI18n();
  const { config: appConfig } = useCompany();
  const dev = appConfig.developer;
  return (
    <div className="pb-32">
      <ScreenHeader title={t('dev.title')} />
      <div className="relative overflow-hidden px-5 py-14 text-center">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: 'radial-gradient(70% 45% at 50% 0%, var(--glow), transparent 65%)' }}
        />
        <div className="jw-grid absolute inset-0 opacity-20" />
        <div className="relative">
          <MaterialIcon3D name="user" accent="navy" size={96} className="mx-auto jw-float" />
          <p className="mt-7 text-[0.68rem] uppercase tracking-[0.3em] text-[color:var(--muted)]">
            {t('dev.credit')}
          </p>
          <h1 className="mt-3 text-[1.6rem] font-extrabold tracking-tight">{bi(dev.name)}</h1>
          <p className="mt-1 text-[0.85rem] text-[color:var(--muted)]">Abdullah AL-Hjry</p>
          <p dir="ltr" className="mt-5 font-mono text-[0.9rem] text-[color:var(--primary)]">
            {dev.phone}
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button variant="ghost" onClick={() => externalActions.call(dev.phone)} icon="phone">
              {t('dev.contact')}
            </Button>
            <Button variant="ghost" onClick={() => externalActions.whatsapp(dev.phone)} icon="whatsapp">
              {t('quick.whatsapp')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

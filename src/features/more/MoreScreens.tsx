import { useState } from 'react';
import { appAssets, appConfig } from '../../data/company';
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
      className="group flex w-full items-center gap-4 border-b border-[color:var(--line)] px-5 py-4 text-start transition-colors last:border-0 hover:bg-[color:var(--surface)]"
    >
      <Glyph name={icon} size={19} className="text-[color:var(--primary)]" />
      <span className="flex-1 text-[0.9rem] font-semibold">{label}</span>
      {meta && <span className="text-[0.74rem] text-[color:var(--faint)]">{meta}</span>}
      <Glyph name="arrow" size={16} className="text-[color:var(--faint)] rtl:-scale-x-100" />
    </button>
  );
}

export function MoreScreen() {
  const { t, bi } = useI18n();
  const { push } = useNav();
  const { theme } = useTheme();

  const go = (route: Route) => () => push(route);

  return (
    <div className="pb-8">
      <ScreenHeader title={t('more.title')} />

      <Reveal className="relative overflow-hidden px-5 py-10">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: 'radial-gradient(85% 60% at 15% 0%, var(--glow), transparent 65%)' }}
        />
        <div className="relative flex items-center gap-4">
          <BrandMark size={52} />
          <div>
            <h2 className="text-[1.1rem] font-extrabold leading-tight tracking-tight">
              {bi(appConfig.companyName)}
            </h2>
            <p className="mt-1 text-[0.74rem] text-[color:var(--muted)]">{appConfig.contact.website}</p>
          </div>
        </div>
      </Reveal>

      <Section title={t('more.company')}>
        <HubRow icon="layers" label={t('about.title')} onClick={go({ name: 'about' })} />
        <HubRow icon="phone" label={t('contact.title')} onClick={go({ name: 'contact' })} />
        <HubRow icon="globe" label={t('more.website')} onClick={() => externalActions.website()} />
      </Section>

      <Section title={t('more.app')}>
        <HubRow
          icon={theme === 'dark' ? 'moon' : 'sun'}
          label={t('more.settings')}
          onClick={go({ name: 'settings' })}
        />
        <HubRow icon="shield" label={t('more.privacy')} onClick={go({ name: 'privacy' })} />
        <HubRow icon="quote" label={t('more.terms')} onClick={go({ name: 'terms' })} />
        <HubRow icon="spark" label={t('more.appInfo')} meta={appConfig.version} onClick={go({ name: 'settings' })} />
      </Section>

      <Section title={t('more.developer')}>
        <HubRow icon="user" label={t('dev.title')} onClick={go({ name: 'developer' })} />
      </Section>

      <BrandFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="px-5 pb-2 text-[0.66rem] uppercase tracking-[0.28em] text-[color:var(--faint)]">
        {title}
      </h3>
      <div className="border-y border-[color:var(--line)] bg-[color:var(--elevated)]">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ About */

export function AboutScreen() {
  const { t, bi } = useI18n();
  return (
    <div className="pb-10">
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

      <Reveal className="border-t border-[color:var(--line)] px-5 py-10">
        <h2 className="mb-6 text-[1.1rem] font-bold tracking-tight">{t('about.scope')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[color:var(--line)] bg-[color:var(--elevated)] p-3"
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
    <div className="pb-10">
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

      <div className="border-y border-[color:var(--line)] bg-[color:var(--elevated)]">
        {methods.map((m) => (
          <div
            key={`${m.label}-${m.value}`}
            className="flex items-center gap-4 border-b border-[color:var(--line)] px-5 py-4 last:border-0"
          >
            <Glyph name={m.icon} size={18} className="text-[color:var(--primary)]" />
            <div className="min-w-0 flex-1">
              <div className="text-[0.68rem] text-[color:var(--faint)]">{m.label}</div>
              <div dir="ltr" className="truncate text-start text-[0.88rem] font-semibold">
                {m.value}
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                const ok = await externalActions.copy(m.value);
                flash(ok ? t('contact.copied') : t('contact.unavailable'));
              }}
              className="rounded-[var(--radius-xs)] border border-[color:var(--line)] px-2.5 py-1.5 text-[0.68rem] text-[color:var(--muted)]"
            >
              ⧉
            </button>
            <button
              type="button"
              onClick={m.run}
              className="rounded-[var(--radius-xs)] bg-[color:var(--primary)]/12 px-3 py-1.5 text-[0.7rem] font-semibold text-[color:var(--primary)]"
            >
              {m.icon === 'mail' ? t('contact.email') : m.icon === 'whatsapp' ? t('quick.whatsapp') : t('quick.call')}
            </button>
          </div>
        ))}
      </div>

      <Reveal className="px-5 py-8">
        <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
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
  const { t, lang, setLang } = useI18n();
  const { mode, setMode, reducedMotion, setReducedMotion } = useTheme();
  const { clear } = useRequests();
  const [toast, setToast] = useState<string | null>(null);

  const modes: { value: ThemeMode; label: string; icon: GlyphName }[] = [
    { value: 'system', label: t('settings.theme.system'), icon: 'spark' },
    { value: 'light', label: t('settings.theme.light'), icon: 'sun' },
    { value: 'dark', label: t('settings.theme.dark'), icon: 'moon' },
  ];

  return (
    <div className="pb-12">
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
                'flex flex-col items-center gap-2 rounded-[var(--radius-sm)] border px-2 py-4 transition-all',
                mode === m.value
                  ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--text)]'
                  : 'border-[color:var(--line)] text-[color:var(--muted)]',
              )}
            >
              <Glyph name={m.icon} size={19} />
              <span className="text-[0.74rem] font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title={t('settings.language')}>
        <div className="grid grid-cols-2 gap-2 p-3">
          {(['ar', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                'rounded-[var(--radius-sm)] border px-3 py-3.5 text-[0.85rem] font-semibold transition-all',
                lang === l
                  ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/10'
                  : 'border-[color:var(--line)] text-[color:var(--muted)]',
              )}
            >
              {l === 'ar' ? 'العربية' : 'English'}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t('settings.motion')}>
        <label className="flex items-center justify-between gap-4 px-5 py-4">
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
        <Divider />
        <div className="px-5 py-4">
          <span className="block text-[0.88rem] font-semibold">{t('settings.notifications')}</span>
          <span className="mt-0.5 block text-[0.72rem] text-[color:var(--muted)]">
            {t('settings.notificationsHint')}
          </span>
        </div>
      </Section>

      <Section title={t('settings.data')}>
        <div className="p-4">
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
        <div className="flex items-center justify-between px-5 py-4">
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
    <div className="pb-14">
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

/* ------------------------------------------------------------ Developer */

export function DeveloperScreen() {
  const { t, bi } = useI18n();
  const dev = appConfig.developer;
  return (
    <div className="pb-14">
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

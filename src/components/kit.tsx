import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';
import { Glyph, type GlyphName } from './icons';
import { useI18n } from '../core/i18n';
import { useNav } from '../core/navigation';

/* ---------------------------------------------------------- Reveal */

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------- Scroll progress */

export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

/* ---------------------------------------------------------- Buttons */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet';
  icon?: GlyphName;
  block?: boolean;
};

export function Button({
  variant = 'primary',
  icon,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden text-[0.95rem] font-semibold tracking-tight',
        'transition-[transform,background,border-color,box-shadow] duration-300 active:scale-[0.975]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]',
        'disabled:cursor-not-allowed disabled:opacity-45',
        block && 'w-full',
        variant === 'primary' &&
          'rounded-[var(--radius-sm)] bg-[color:var(--primary)] px-6 py-3.5 text-[color:var(--primary-ink)] shadow-[0_10px_30px_-12px_var(--glow)]',
        variant === 'secondary' &&
          'rounded-[var(--radius-sm)] border border-[color:var(--line-strong)] bg-[color:var(--sheen)] px-6 py-3.5 text-[color:var(--text)] backdrop-blur',
        variant === 'ghost' &&
          'rounded-[var(--radius-sm)] border border-[color:var(--line)] px-5 py-3 text-[color:var(--text)]',
        variant === 'quiet' && 'px-2 py-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)]',
        className,
      )}
    >
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 group-hover:[animation:jw-sweep_0.9s_ease-out]" />
      )}
      <span className="relative">{children}</span>
      {icon && <Glyph name={icon} size={17} className="relative rtl:-scale-x-100" />}
    </button>
  );
}

/* ---------------------------------------------------------- Chip */

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-[0.8rem] font-medium transition-all duration-300',
        active
          ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/12 text-[color:var(--primary)]'
          : 'border-[color:var(--line)] text-[color:var(--muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--text)]',
      )}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------- Section heading */

export function SectionHead({
  kicker,
  title,
  action,
  onAction,
}: {
  kicker?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 px-5">
      <div>
        {kicker && (
          <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[color:var(--primary)]">
            <span className="h-px w-6 bg-[color:var(--primary)]/60" />
            {kicker}
          </div>
        )}
        <h2 className="text-[1.65rem] font-bold leading-[1.2] tracking-tight text-[color:var(--text)]">
          {title}
        </h2>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 pb-1 text-[0.8rem] font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- Screen header */

export function ScreenHeader({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}) {
  const { back, canGoBack } = useNav();
  const { t } = useI18n();
  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-30 border-b border-[color:var(--line)] bg-[color:var(--bg)]/85 px-5 py-3.5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {canGoBack && (
          <button
            type="button"
            onClick={back}
            aria-label={t('common.back')}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-[color:var(--line)] text-[color:var(--text)] transition-colors hover:border-[color:var(--line-strong)]"
          >
            <Glyph name="arrow" size={18} className="ltr:-scale-x-100" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[1.05rem] font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-[0.72rem] text-[color:var(--muted)]">{subtitle}</p>}
        </div>
        {trailing}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------- Form fields */

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <span className="text-[0.78rem] font-semibold tracking-tight text-[color:var(--text)]">{children}</span>
      {hint && <span className="text-[0.68rem] text-[color:var(--faint)]">({hint})</span>}
    </div>
  );
}

const fieldClass =
  'w-full rounded-[var(--radius-sm)] border border-[color:var(--line)] bg-[color:var(--elevated)] px-4 py-3.5 text-[0.9rem] text-[color:var(--text)] placeholder:text-[color:var(--faint)] outline-none transition-colors focus:border-[color:var(--primary)]';

export function TextField({
  label,
  error,
  hint,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <input
        {...rest}
        aria-invalid={Boolean(error)}
        className={cn(fieldClass, error && 'border-[color:var(--error)]')}
      />
      {error && <p className="mt-1.5 text-[0.72rem] text-[color:var(--error)]">{error}</p>}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <textarea
        {...rest}
        rows={rest.rows ?? 4}
        aria-invalid={Boolean(error)}
        className={cn(fieldClass, 'resize-none leading-relaxed', error && 'border-[color:var(--error)]')}
      />
      {error && <p className="mt-1.5 text-[0.72rem] text-[color:var(--error)]">{error}</p>}
    </div>
  );
}

export function OptionGrid({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className={cn('grid gap-2.5', columns === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={cn(
              'relative overflow-hidden rounded-[var(--radius-sm)] border px-3 py-3.5 text-start text-[0.82rem] font-medium transition-all duration-300',
              active
                ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--text)]'
                : 'border-[color:var(--line)] bg-[color:var(--elevated)] text-[color:var(--muted)] hover:border-[color:var(--line-strong)]',
            )}
          >
            {o.label}
            {active && <span className="absolute inset-y-0 start-0 w-[3px] bg-[color:var(--primary)]" />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- Misc */

export function Divider() {
  return <div className="jw-hairline h-px w-full" />;
}

export function DemoBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line-strong)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
      {label}
    </span>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-6">
      <div className="jw-rise rounded-full border border-[color:var(--line-strong)] bg-[color:var(--elevated)] px-5 py-3 text-[0.82rem] font-medium text-[color:var(--text)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
        {message}
      </div>
    </div>
  );
}

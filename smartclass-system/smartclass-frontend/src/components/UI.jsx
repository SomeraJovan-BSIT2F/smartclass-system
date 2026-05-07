// src/components/UI.jsx — design system primitives
import { ArrowUpRight } from 'lucide-react';

export const Card = ({ children, className = '', ...rest }) => (
  <div
    className={`bg-white border rounded-2xl ${className}`}
    style={{ borderColor: 'var(--rule)' }}
    {...rest}
  >
    {children}
  </div>
);

export const Pill = ({ tone = 'muted', children }) => {
  const map = {
    muted:  { bg: '#F3EEE5', fg: 'var(--muted)', bd: 'var(--rule)' },
    ok:     { bg: '#E8F1EB', fg: 'var(--ok)',     bd: '#C8DCD0' },
    warn:   { bg: '#FBF0DC', fg: '#8A5E12',       bd: '#EBD5A6' },
    bad:    { bg: '#F4DBD5', fg: 'var(--bad)',    bd: '#E5B6AC' },
    accent: { bg: '#F4DCD3', fg: 'var(--accent)', bd: '#E5BBA9' },
  }[tone] || {};
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border tracking-wide uppercase"
      style={{ background: map.bg, color: map.fg, borderColor: map.bd }}
    >
      {children}
    </span>
  );
};

export const Button = ({ children, variant = 'primary', loading, className = '', ...rest }) => {
  const styles = {
    primary: { bg: 'var(--ink)',    fg: 'var(--paper)', bd: 'var(--ink)' },
    accent:  { bg: 'var(--accent)', fg: '#fff',         bd: 'var(--accent)' },
    ghost:   { bg: 'transparent',   fg: 'var(--ink)',   bd: 'var(--rule)' },
    subtle:  { bg: 'var(--cream)',  fg: 'var(--ink)',   bd: 'var(--rule)' },
    danger:  { bg: 'var(--bad)',    fg: '#fff',         bd: 'var(--bad)' },
  }[variant];
  return (
    <button
      disabled={loading || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: styles.bg,
        color: styles.fg,
        borderColor: styles.bd,
      }}
      {...rest}
    >
      {loading && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin-slow" />}
      {children}
    </button>
  );
};

export const StatCard = ({ label, value, delta, icon: Icon, tone = 'ok' }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          {label}
        </div>
        <div className="mt-2 font-serif text-4xl leading-none">
          {value}
        </div>
        {delta && (
          <div
            className="mt-2 text-xs flex items-center gap-1"
            style={{ color: tone === 'bad' ? 'var(--bad)' : 'var(--ok)' }}
          >
            <ArrowUpRight size={12} />
            {delta}
          </div>
        )}
      </div>
      {Icon && (
        <div
          className="w-9 h-9 rounded-full grid place-items-center border"
          style={{ borderColor: 'var(--rule)', color: 'var(--accent)' }}
        >
          <Icon size={16} />
        </div>
      )}
    </div>
  </Card>
);

export const SectionHeader = ({ eyebrow, title, sub, action }) => (
  <div className="flex items-end justify-between gap-4 flex-wrap">
    <div>
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
          {eyebrow}
        </div>
      )}
      <h1 className="font-serif text-3xl lg:text-4xl mt-2 leading-[1.05]">
        {title}
      </h1>
      {sub && (
        <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--muted)' }}>
          {sub}
        </p>
      )}
    </div>
    {action}
  </div>
);

export const Field = ({ label, children, full, error }) => (
  <label className={`block ${full ? 'lg:col-span-2' : ''}`}>
    <span
      className="text-[11px] uppercase tracking-[0.14em] block mb-1.5"
      style={{ color: 'var(--muted)' }}
    >
      {label}
    </span>
    {children}
    {error && <span className="text-xs mt-1 block" style={{ color: 'var(--bad)' }}>{error}</span>}
  </label>
);

export const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 rounded-xl border bg-white text-sm ${props.className || ''}`}
    style={{ borderColor: 'var(--rule)', ...props.style }}
  />
);

export const Select = (props) => (
  <select
    {...props}
    className={`w-full px-3 py-2.5 rounded-xl border bg-white text-sm ${props.className || ''}`}
    style={{ borderColor: 'var(--rule)', ...props.style }}
  >
    {props.children}
  </select>
);

export const Textarea = (props) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2.5 rounded-xl border bg-white text-sm ${props.className || ''}`}
    style={{ borderColor: 'var(--rule)', ...props.style }}
  />
);

export const Spinner = ({ size = 20 }) => (
  <span
    className="border-2 border-current border-t-transparent rounded-full animate-spin-slow inline-block"
    style={{ width: size, height: size, color: 'var(--accent)' }}
  />
);

export const Empty = ({ title, sub }) => (
  <div className="text-center py-12">
    <div className="font-serif text-xl">{title}</div>
    {sub && <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{sub}</p>}
  </div>
);

export const ErrorBanner = ({ children, onClose }) => (
  <div
    className="p-3 rounded-xl border text-sm flex items-start gap-3"
    style={{ background: '#F4DBD5', borderColor: '#E5B6AC', color: 'var(--bad)' }}
    role="alert"
  >
    <span className="flex-1">{children}</span>
    {onClose && (
      <button onClick={onClose} className="font-bold">×</button>
    )}
  </div>
);

export const SuccessBanner = ({ children }) => (
  <div
    className="p-3 rounded-xl border text-sm"
    style={{ background: '#E8F1EB', borderColor: '#C8DCD0', color: 'var(--ok)' }}
    role="status"
  >
    {children}
  </div>
);

// src/components/Shell.jsx — top bar, sidebar, panels
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  QrCode, Bell, Search, Menu, X, Eye, Type, Contrast, Keyboard,
  ShieldCheck, LogOut, Sparkles, Home, Camera, BarChart3, FileText,
  Settings, Mail, Users, BookOpen, ChevronRight, AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth, useA11y } from '../context/AppContext';
import { api } from '../lib/api';
import { Card, Pill } from './UI';

const NAV = {
  admin: [
    { to: '/dashboard', icon: Home,      label: 'Dashboard' },
    { to: '/sections',  icon: BookOpen,  label: 'Sections' },
    { to: '/users',     icon: Users,     label: 'Users' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/reports',   icon: FileText,  label: 'Reports' },
    { to: '/settings',  icon: Settings,  label: 'Settings' },
  ],
  teacher: [
    { to: '/dashboard', icon: Home,      label: 'Dashboard' },
    { to: '/scanner',   icon: Camera,    label: 'QR Scanner', badge: 'Live' },
    { to: '/sections',  icon: BookOpen,  label: 'My Sections' },
    { to: '/excuses',   icon: Mail,      label: 'Excuse Letters' },
    { to: '/reports',   icon: FileText,  label: 'Reports' },
    { to: '/settings',  icon: Settings,  label: 'Settings' },
  ],
  student: [
    { to: '/dashboard', icon: Home,      label: 'Dashboard' },
    { to: '/excuses',   icon: Mail,      label: 'Excuse Letter' },
    { to: '/reports',   icon: FileText,  label: 'My Reports' },
    { to: '/settings',  icon: Settings,  label: 'Settings' },
  ],
};

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Poll notifications every 30 seconds
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { notifications, unread } = await api.notifications();
        if (mounted) {
          setNotifications(notifications);
          setUnread(unread);
        }
      } catch { /* silent */ }
    };
    load();
    const t = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const navItems = NAV[user?.role] || [];

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded z-50"
      >
        Skip to main content
      </a>

      <TopBar
        user={user}
        unread={unread}
        onMenu={() => setMenuOpen(true)}
        onA11y={() => setA11yOpen(true)}
        onNotif={() => setNotifOpen(true)}
        onLogout={onLogout}
      />

      <div className="mx-auto max-w-[1400px] w-full flex flex-1">
        <SideNav
          items={navItems}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main
          id="main"
          tabIndex={-1}
          className="flex-1 min-w-0 p-4 lg:p-8"
        >
          {children}

          <footer
            className="mt-16 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em]"
            style={{ borderColor: 'var(--rule)', color: 'var(--muted)' }}
          >
            <div>SmartClass QR · v1.0 · WCAG 2.1 AA</div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Support</a>
            </div>
          </footer>
        </main>
      </div>

      <A11yPanel open={a11yOpen} onClose={() => setA11yOpen(false)} />
      <NotifPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAll={async () => {
          await api.markAllRead();
          const { notifications, unread } = await api.notifications();
          setNotifications(notifications);
          setUnread(unread);
        }}
      />
    </div>
  );
}

// ─── Top Bar ───────────────────────────────────────────────────────────
function TopBar({ user, unread, onMenu, onA11y, onNotif, onLogout }) {
  const initials = (user?.name || '')
    .split(' ').map(s => s[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        background: 'rgba(250,247,242,0.85)',
        borderColor: 'var(--rule)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 h-16 flex items-center gap-4">
        <button onClick={onMenu} className="lg:hidden p-2 -ml-2" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md grid place-items-center"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <QrCode size={16} />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[17px] tracking-tight">
              SmartClass <span style={{ color: 'var(--accent)' }}>QR</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--muted)' }}>
              Classroom Intelligence
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 ml-6 flex-1 max-w-md">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full border"
            style={{ borderColor: 'var(--rule)', background: '#fff' }}
          >
            <Search size={14} style={{ color: 'var(--muted)' }} />
            <input
              className="bg-transparent outline-none text-sm flex-1"
              placeholder="Search…"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onA11y}
            className="p-2 rounded-full border hover:bg-white transition"
            style={{ borderColor: 'var(--rule)' }}
            aria-label="Accessibility settings"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onNotif}
            className="relative p-2 rounded-full border hover:bg-white transition"
            style={{ borderColor: 'var(--rule)' }}
            aria-label={`Notifications (${unread} unread)`}
          >
            <Bell size={16} />
            {unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] grid place-items-center font-bold"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <div
            className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l"
            style={{ borderColor: 'var(--rule)' }}
          >
            <div
              className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-semibold"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              {initials}
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium">{user?.name}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                {user?.role}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 p-2 rounded-full border hover:bg-white transition"
              style={{ borderColor: 'var(--rule)' }}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Side Navigation ───────────────────────────────────────────────────
function SideNav({ items, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-16 left-0 z-40 lg:z-0
          h-screen lg:h-[calc(100vh-4rem)] w-[260px] shrink-0
          border-r p-4 transition-transform
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: 'var(--paper)', borderColor: 'var(--rule)' }}
      >
        <div className="lg:hidden flex justify-end mb-2">
          <button onClick={onClose} aria-label="Close menu" className="p-1">
            <X size={18} />
          </button>
        </div>

        <div
          className="text-[10px] uppercase tracking-[0.18em] px-3 mb-3"
          style={{ color: 'var(--muted)' }}
        >
          Workspace
        </div>

        <nav className="space-y-1" role="navigation" aria-label="Primary">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive ? 'bg-[var(--ink)] text-[var(--paper)]' : 'hover:bg-[var(--cream)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <it.icon
                    size={16}
                    style={{ color: isActive ? 'var(--paper)' : 'var(--muted)' }}
                  />
                  <span className="flex-1 text-left">{it.label}</span>
                  {it.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{
                        background: isActive ? 'var(--accent)' : 'var(--cream)',
                        color: isActive ? '#fff' : 'var(--ink)',
                      }}
                    >
                      {it.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3" style={{ background: 'var(--cream)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={12} style={{ color: 'var(--accent)' }} />
              <div className="text-[11px] font-semibold uppercase tracking-wider">Semester</div>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>1st Sem · 2025–2026</div>
            <div
              className="mt-2 h-1 rounded-full overflow-hidden"
              style={{ background: 'var(--rule)' }}
            >
              <div className="h-full" style={{ width: '44%', background: 'var(--accent)' }} />
            </div>
          </Card>
        </div>
      </aside>
    </>
  );
}

// ─── Accessibility Panel ───────────────────────────────────────────────
function A11yPanel({ open, onClose }) {
  const { settings, update } = useA11y();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto p-6 animate-fadeIn"
        style={{ background: 'var(--paper)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
              Settings
            </div>
            <h2 className="font-serif text-2xl mt-1">Accessibility</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2"><X size={18} /></button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium">Text size</span>
            </div>
            <div className="flex gap-2">
              {[0.9, 1.0, 1.15, 1.3].map((v, i) => (
                <button
                  key={v}
                  onClick={() => update({ fontScale: v })}
                  className="flex-1 py-3 rounded-xl border transition-all"
                  style={{
                    borderColor: settings.fontScale === v ? 'var(--ink)' : 'var(--rule)',
                    background: settings.fontScale === v ? 'var(--ink)' : '#fff',
                    color: settings.fontScale === v ? 'var(--paper)' : 'var(--ink)',
                    fontSize: `${10 + i * 3}px`,
                  }}
                  aria-pressed={settings.fontScale === v}
                >
                  A
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Contrast size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium">High contrast</span>
            </div>
            <button
              onClick={() => update({ highContrast: !settings.highContrast })}
              className="w-full p-3 rounded-xl border flex items-center justify-between"
              style={{ borderColor: 'var(--rule)', background: '#fff' }}
              role="switch"
              aria-checked={settings.highContrast}
            >
              <span className="text-sm">Enable high-contrast mode</span>
              <span
                className="w-10 h-6 rounded-full p-0.5 transition-colors"
                style={{ background: settings.highContrast ? 'var(--ink)' : 'var(--rule)' }}
              >
                <span
                  className="block w-5 h-5 bg-white rounded-full transition-transform"
                  style={{ transform: settings.highContrast ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Keyboard size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium">Keyboard navigation</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[['Tab', 'Next'], ['Shift+Tab', 'Previous'], ['Enter', 'Activate'], ['Esc', 'Close']].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center gap-2 p-2 rounded-lg border"
                  style={{ borderColor: 'var(--rule)', background: '#fff' }}
                >
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[10px]"
                    style={{ background: 'var(--cream)' }}
                  >
                    {k}
                  </kbd>
                  <span style={{ color: 'var(--muted)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{ background: 'var(--cream)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--ok)' }} />
            <div className="text-sm font-medium mt-2">WCAG 2.1 AA compliant</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Semantic HTML, ARIA attributes, focus indicators, and visual notification fallbacks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications Panel ───────────────────────────────────────────────
function NotifPanel({ open, onClose, notifications, onMarkAll }) {
  if (!open) return null;
  const tone = (t) => t === 'attendance' ? 'ok' : t === 'excuse' ? 'warn' : t === 'grade' ? 'accent' : 'muted';
  const Icon = (t) => t === 'attendance' ? CheckCircle2 : t === 'excuse' ? AlertTriangle : Bell;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div
        className="relative w-full max-w-sm h-full overflow-y-auto p-6 animate-fadeIn"
        style={{ background: 'var(--paper)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Notifications</h2>
          <button onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onMarkAll}
            className="text-xs underline mb-4"
            style={{ color: 'var(--accent)' }}
          >
            Mark all as read
          </button>
        )}
        <div className="space-y-2">
          {notifications.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--muted)' }}>
              No notifications yet.
            </div>
          )}
          {notifications.map((n) => {
            const I = Icon(n.type);
            return (
              <div
                key={n.id}
                className="p-3 rounded-xl border bg-white"
                style={{
                  borderColor: 'var(--rule)',
                  opacity: n.is_read ? 0.7 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  <I size={16} style={{ color: `var(--${tone(n.type)})` }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {n.body}
                    </div>
                    <div
                      className="text-[10px] mt-1.5 uppercase tracking-wider"
                      style={{ color: 'var(--muted)' }}
                    >
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                  {!n.is_read && (
                    <span
                      className="w-2 h-2 rounded-full mt-1.5"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

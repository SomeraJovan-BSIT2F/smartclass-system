// src/pages/Landing.jsx — public marketing/welcome page
import { Link } from 'react-router-dom';
import {
  QrCode, Camera, BarChart3, Mail, ShieldCheck, Eye, Users,
  ArrowRight, CheckCircle2, BookOpen, GraduationCap, Sparkles,
  Clock, FileText, Zap,
} from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* ─── Top bar ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ background: 'rgba(250,247,242,0.85)', borderColor: 'var(--rule)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
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
              <div
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--muted)' }}
              >
                Classroom Intelligence
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a href="#features" className="hover:opacity-70 transition">Features</a>
            <a href="#how" className="hover:opacity-70 transition">How it works</a>
            <a href="#roles" className="hover:opacity-70 transition">For schools</a>
            <a href="#about" className="hover:opacity-70 transition">About</a>
          </nav>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition hover:translate-y-[-1px]"
            style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderColor: 'var(--ink)',
            }}
          >
            Sign in <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'var(--rule)' }}>
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] uppercase tracking-[0.18em]"
              style={{ borderColor: 'var(--rule)', color: 'var(--accent)' }}
            >
              <Sparkles size={11} /> Volume I · Edition 2025
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl mt-5 leading-[1.02] tracking-tight">
              The end of the <em>paper roster</em>.
            </h1>
            <p
              className="mt-6 text-base lg:text-lg max-w-xl leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              SmartClass QR is an intelligent classroom management platform that
              turns daily attendance into instant insight — and gives teachers
              the time back to teach.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border transition hover:translate-y-[-1px]"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  borderColor: 'var(--accent)',
                }}
              >
                Sign in to your account <ArrowRight size={14} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border transition hover:bg-white"
                style={{ borderColor: 'var(--rule)' }}
              >
                See how it works
              </a>
            </div>
            <div
              className="mt-8 flex items-center gap-5 text-xs"
              style={{ color: 'var(--muted)' }}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} /> JWT secured
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={13} /> WCAG 2.1 AA
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={13} /> Realtime sync
              </div>
            </div>
          </div>

          {/* Right: stylized hero card */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, var(--accent), transparent 70%)',
              }}
              aria-hidden
            />
            <div
              className="relative rounded-2xl border overflow-hidden shadow-sm"
              style={{ borderColor: 'var(--rule)', background: '#fff' }}
            >
              <div
                className="px-5 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--rule)', background: 'var(--cream)' }}
              >
                <div
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--muted)' }}
                >
                  Live class · BSCS-3A
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: 'var(--ok)' }}
                  />
                  <span className="text-[10px] uppercase tracking-wider">
                    REC
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-5">
                {/* QR illustration */}
                <div
                  className="aspect-square rounded-xl border-2 border-dashed grid place-items-center"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <div className="grid grid-cols-7 gap-0.5 w-32 h-32">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-[1px]"
                        style={{
                          background:
                            (i * 7 + i) % 3 === 0 || i === 24
                              ? 'var(--ink)'
                              : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: 'var(--muted)' }}
                    >
                      Today's attendance
                    </div>
                    <div className="font-serif text-5xl mt-1">94%</div>
                    <div
                      className="text-xs mt-1"
                      style={{ color: 'var(--ok)' }}
                    >
                      ↑ 4 from last session
                    </div>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    {[
                      { name: 'Adelia Reyes', t: '08:58' },
                      { name: 'Bennett Cruz', t: '09:01' },
                      { name: 'Carmela Tan', t: '09:02' },
                    ].map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <CheckCircle2
                          size={12}
                          style={{ color: 'var(--ok)' }}
                        />
                        <span className="flex-1 truncate">{s.name}</span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: 'var(--muted)' }}
                        >
                          {s.t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ───────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: '< 2s', l: 'per scan' },
            { v: '0', l: 'paper rosters' },
            { v: '14', l: 'database tables' },
            { v: '100%', l: 'auditable' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-serif text-4xl lg:text-5xl">{s.v}</div>
              <div
                className="text-[11px] uppercase tracking-[0.18em] mt-1"
                style={{ color: 'var(--muted)' }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────── */}
      <section id="features" className="border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}
            >
              Capabilities
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-3 leading-[1.05]">
              Built for the way modern educators actually <em>work</em>.
            </h2>
            <p
              className="mt-4 text-base"
              style={{ color: 'var(--muted)' }}
            >
              Every feature serves a single goal: less friction, more teaching.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Camera,
                title: 'Instant QR attendance',
                desc: 'Open the camera, students tap their semester QR. Each scan is timestamped, deduplicated, and synced live.',
              },
              {
                icon: BarChart3,
                title: 'Live performance analytics',
                desc: 'Charts that surface at-risk students automatically — by attendance, grade, or engagement signals.',
              },
              {
                icon: Mail,
                title: 'Excuse-letter workflow',
                desc: 'Students upload supporting documents. Teachers approve or reject. Attendance updates automatically.',
              },
              {
                icon: FileText,
                title: 'PDF reports on demand',
                desc: 'Per-section attendance summaries and per-student performance reports — generated on the server in real time.',
              },
              {
                icon: Eye,
                title: 'Accessibility first',
                desc: 'WCAG 2.1 AA throughout: keyboard navigation, ARIA labels, font scaling, and a high-contrast mode for low-vision users.',
              },
              {
                icon: ShieldCheck,
                title: 'Auditable by design',
                desc: 'Every authentication, scan, and grade change is logged. Role-based access enforced top to bottom.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border bg-white hover:shadow-sm transition"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div
                  className="w-10 h-10 rounded-full grid place-items-center"
                  style={{
                    background: 'var(--cream)',
                    color: 'var(--accent)',
                  }}
                >
                  <f.icon size={18} />
                </div>
                <h3 className="font-serif text-xl mt-4">{f.title}</h3>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────────────── */}
      <section id="how" className="border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}
            >
              How it works
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-3 leading-[1.05]">
              From login to insight — in three movements.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                title: 'Issue & distribute',
                desc: 'Admins generate semester QRs in batches. Each student receives a unique, expiring code on their dashboard.',
              },
              {
                n: '02',
                title: 'Scan in class',
                desc: 'Teachers open the scanner. The camera reads each student\'s QR. The roster updates in real time.',
              },
              {
                n: '03',
                title: 'Analyze & export',
                desc: 'Attendance, grades, and excuse letters flow into one dashboard. PDFs download with a single click.',
              },
            ].map((step) => (
              <div key={step.n} className="relative">
                <div
                  className="font-serif text-7xl leading-none"
                  style={{ color: 'var(--cream)' }}
                >
                  {step.n}
                </div>
                <h3 className="font-serif text-2xl mt-2">{step.title}</h3>
                <p
                  className="text-sm mt-3 leading-relaxed max-w-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── For roles ─────────────────────────────────────────────── */}
      <section id="roles" className="border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}
            >
              For every role
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-3 leading-[1.05]">
              One platform. <em>Three perspectives.</em>
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                role: 'Administrators',
                desc: 'Manage users, sections, and semesters. Watch institution-wide trends and audit every change.',
                bullets: [
                  'User management with role assignment',
                  'Batch QR issuance per section',
                  'Institution-wide attendance trends',
                  'Full audit log of every action',
                ],
              },
              {
                icon: BookOpen,
                role: 'Teachers',
                desc: 'Track attendance in seconds, post grades, and review excuse letters — all from one dashboard.',
                bullets: [
                  'Live QR scanner with auto-roster',
                  'Gradebook with weighted items',
                  'Excuse-letter approval workflow',
                  'PDF reports per section',
                ],
              },
              {
                icon: GraduationCap,
                role: 'Students',
                desc: 'See your QR, your attendance, your grades, and submit excuses — without ever leaving the page.',
                bullets: [
                  'Personal semester QR code',
                  'Real-time attendance & grades',
                  'Online excuse-letter submission',
                  'Downloadable performance report',
                ],
              },
            ].map((r) => (
              <div
                key={r.role}
                className="p-6 rounded-2xl border bg-white"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div
                  className="w-10 h-10 rounded-full grid place-items-center"
                  style={{
                    background: 'var(--ink)',
                    color: 'var(--paper)',
                  }}
                >
                  <r.icon size={18} />
                </div>
                <h3 className="font-serif text-2xl mt-4">{r.role}</h3>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  {r.desc}
                </p>
                <ul className="mt-5 space-y-2">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: 'var(--accent)' }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About ─────────────────────────────────────────────────── */}
      <section id="about" className="border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}
            >
              About the project
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl mt-3 leading-[1.05]">
              An academic project, built like a product.
            </h2>
            <p
              className="mt-5 text-base leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              SmartClass QR is a complete classroom intelligence system spanning a
              React frontend, a Node.js + Express API, and a MySQL database — designed
              to demonstrate end-to-end software engineering: from authentication and
              role-based access to real-time scanning and PDF reporting.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 max-w-md">
              {[
                'React + Vite',
                'Node.js + Express',
                'MySQL 8',
                'Tailwind CSS',
                'JWT auth',
                'WCAG 2.1 AA',
              ].map((t) => (
                <div
                  key={t}
                  className="px-3 py-2 rounded-lg border text-xs flex items-center gap-2"
                  style={{ borderColor: 'var(--rule)', background: '#fff' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative rounded-2xl border p-8 overflow-hidden"
            style={{
              background: 'var(--ink)',
              borderColor: 'var(--ink)',
              color: 'var(--paper)',
            }}
          >
            <div
              className="absolute -top-12 -right-12 w-72 h-72 rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle, var(--accent), transparent 70%)',
              }}
              aria-hidden
            />
            <div className="relative">
              <Clock size={20} />
              <p className="font-serif text-2xl mt-5 leading-relaxed">
                "We built this so a teacher walking into a classroom of forty
                students could mark attendance, identify who's at risk, and
                generate a report — all before the bell rings."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full grid place-items-center text-xs font-semibold"
                  style={{ background: 'var(--accent)' }}
                >
                  PT
                </div>
                <div>
                  <div className="text-sm">Project team</div>
                  <div
                    className="text-xs opacity-60 uppercase tracking-wider"
                    style={{ color: 'rgba(250,247,242,0.6)' }}
                  >
                    Capstone · 2025–2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--cream)' }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20 text-center">
          <h2 className="font-serif text-4xl lg:text-6xl leading-[1.05]">
            Ready when you are.
          </h2>
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            Sign in with the credentials issued by your institution to access
            your dashboard.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 mt-8 rounded-full text-sm font-medium border transition hover:translate-y-[-1px]"
            style={{
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderColor: 'var(--ink)',
            }}
          >
            Go to sign in <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer
        className="border-t"
        style={{ borderColor: 'var(--rule)', background: 'var(--paper)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-md grid place-items-center"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              <QrCode size={14} />
            </div>
            <span className="font-serif">
              SmartClass <span style={{ color: 'var(--accent)' }}>QR</span>
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.14em] ml-2"
              style={{ color: 'var(--muted)' }}
            >
              v1.0 · WCAG 2.1 AA
            </span>
          </div>

          <div
            className="flex gap-5 text-[11px] uppercase tracking-[0.14em]"
            style={{ color: 'var(--muted)' }}
          >
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Support</a>
            <span>© 2025–2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

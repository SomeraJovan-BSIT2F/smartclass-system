// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AppContext';
import { Button, Field, Input, ErrorBanner } from '../components/UI';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: 'var(--paper)' }}>
      <div
        className="hidden lg:block relative overflow-hidden"
        style={{ background: 'var(--ink)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(at 30% 20%, rgba(182,69,44,0.25), transparent 50%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden
        />
        <div
          className="relative h-full flex flex-col justify-between p-10"
          style={{ color: 'var(--paper)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-md grid place-items-center"
              style={{ background: 'var(--paper)', color: 'var(--ink)' }}
            >
              <QrCode size={18} />
            </div>
            <div>
              <div className="font-serif text-xl">
                SmartClass <span style={{ color: 'var(--accent)' }}>QR</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-60">
                Classroom Intelligence
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] opacity-60">
              Volume I · Edition 2025
            </div>
            <h1 className="font-serif text-5xl xl:text-6xl mt-3 leading-[1.05]">
              The end of the<br />
              <em>paper roster</em>.
            </h1>
            <p className="text-base opacity-70 mt-5 max-w-md leading-relaxed">
              An intelligent, accessible classroom management platform — built for the way modern educators actually work.
            </p>
          </div>

          <div className="text-[11px] opacity-50 uppercase tracking-[0.14em]">
            © Academic Year 2025–2026
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            Sign in
          </div>
          <h2 className="font-serif text-3xl mt-2">Welcome back.</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
            Enter the credentials issued by your institution.
          </p>

          <div className="mt-7 space-y-4">
            {error && <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>}

            <Field label="Institution email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                placeholder="name@university.edu"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </Field>

            <Button type="submit" variant="primary" loading={loading} className="w-full !py-3">
              Continue <ChevronRight size={14} />
            </Button>

            <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>
              Secured with JWT authentication
            </div>

            <div
              className="mt-6 p-3 rounded-xl border text-xs"
              style={{ background: 'var(--cream)', borderColor: 'var(--rule)' }}
            >
              <div className="font-semibold mb-1.5">Demo accounts (password: Password123!)</div>
              <ul className="space-y-1" style={{ color: 'var(--muted)' }}>
                <li><strong>Admin:</strong> admin@smartclass.edu</li>
                <li><strong>Teacher:</strong> almonte@smartclass.edu</li>
                <li><strong>Student:</strong> adelia@smartclass.edu</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// src/pages/Sections.jsx
import { useEffect, useState } from 'react';
import { Users, QrCode, X } from 'lucide-react';
import { api } from '../lib/api';
import {
  Card, Pill, SectionHeader, Button, Spinner, ErrorBanner, SuccessBanner,
  Field, Input, Select,
} from '../components/UI';
import { useAuth } from '../context/AppContext';

export default function Sections() {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { sections } = await api.listSections();
      setSections(sections);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const issueBatch = async (section) => {
    if (!confirm(`Generate QR codes for all students in ${section.code}? Existing codes will be rotated.`)) return;
    try {
      const r = await api.issueQrBatch(section.id, section.semester_id);
      setInfo(`Issued ${r.count} QR codes for ${section.code}.`);
    } catch (e) { setError(e.message); }
  };

  if (loading) return <div className="grid place-items-center h-96"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Academic sections"
        title={user?.role === 'admin' ? 'All sections' : 'My sections'}
        sub="Manage rosters, generate QR codes, and view per-section analytics."
      />

      {error && <ErrorBanner onClose={() => setError(null)}>{error}</ErrorBanner>}
      {info && <SuccessBanner>{info}</SuccessBanner>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.length === 0 && (
          <Card className="p-12 text-center text-sm md:col-span-2 lg:col-span-3" style={{ color: 'var(--muted)' }}>
            No sections yet.
          </Card>
        )}
        {sections.map(s => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
                  {s.code}
                </div>
                <div className="font-serif text-xl mt-1">{s.subject}</div>
              </div>
              <Pill tone={s.status === 'active' ? 'ok' : 'muted'}>{s.status}</Pill>
            </div>
            <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
              {s.schedule || 'Schedule TBA'} · {s.teacher_name}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Users size={14} style={{ color: 'var(--muted)' }} />
              <span className="text-sm">{s.student_count} students</span>
            </div>
            <div className="mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setSelected(s)}
              >
                View roster
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="subtle"
                  className="w-full"
                  onClick={() => issueBatch(s)}
                >
                  <QrCode size={14} /> Issue QR batch
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selected && <SectionRoster section={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SectionRoster({ section, onClose }) {
  const [data, setData] = useState(null);
  useEffect(() => { api.getSection(section.id).then(setData); }, [section]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}
            >
              {section.code}
            </div>
            <h3 className="font-serif text-2xl">{section.subject}</h3>
          </div>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {!data ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-[11px] uppercase tracking-wider"
                  style={{ color: 'var(--muted)' }}
                >
                  <th className="py-2 font-medium">Student #</th>
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map(st => (
                  <tr key={st.id} className="border-t" style={{ borderColor: 'var(--rule)' }}>
                    <td className="py-2 font-mono text-xs">{st.student_number}</td>
                    <td className="py-2">{st.name}</td>
                    <td className="py-2" style={{ color: 'var(--muted)' }}>{st.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

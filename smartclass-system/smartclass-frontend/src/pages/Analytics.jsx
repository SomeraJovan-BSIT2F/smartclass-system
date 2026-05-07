// src/pages/Analytics.jsx
import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { api } from '../lib/api';
import {
  Card, SectionHeader, Spinner, ErrorBanner,
} from '../components/UI';
import { useAuth } from '../context/AppContext';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (user?.role === 'admin') {
          setStats(await api.institutionStats());
        } else if (user?.role === 'teacher') {
          const { sections } = await api.listSections();
          if (sections[0]) setStats(await api.sectionStats(sections[0].id));
        }
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [user]);

  if (loading) return <div className="grid place-items-center h-96"><Spinner /></div>;
  if (error) return <ErrorBanner>{error}</ErrorBanner>;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Performance analytics"
        title="Insights"
        sub="Identify patterns, surface at-risk students, and track engagement."
      />

      {stats?.trend && stats.trend.length > 0 && (
        <Card className="p-6">
          <h3 className="font-serif text-2xl mb-4">Attendance trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={stats.trend.map(t => ({
                day: new Date(t.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                present: Number(t.present),
                late: Number(t.late),
                absent: Number(t.absent),
                excused: Number(t.excused || 0),
              }))}
            >
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid var(--rule)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="present" stackId="a" fill="var(--ok)" />
              <Bar dataKey="late" stackId="a" fill="var(--warn)" />
              <Bar dataKey="excused" stackId="a" fill="var(--accent)" />
              <Bar dataKey="absent" stackId="a" fill="var(--bad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {stats?.performanceTrend && stats.performanceTrend.length > 0 && (
        <Card className="p-6">
          <h3 className="font-serif text-2xl mb-4">Performance over time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.performanceTrend}>
              <CartesianGrid stroke="var(--rule)" vertical={false} />
              <XAxis dataKey="week" stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid var(--rule)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="var(--ink)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {!stats?.trend && !stats?.performanceTrend && (
        <Card className="p-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
          No analytics data yet. Once attendance is recorded and grades are posted,
          insights will appear here.
        </Card>
      )}
    </div>
  );
}

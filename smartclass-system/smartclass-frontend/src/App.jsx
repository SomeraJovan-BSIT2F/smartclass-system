// src/App.jsx — routing + role-based protection
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, A11yProvider, useAuth } from './context/AppContext';

import Shell from './components/Shell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Scanner from './pages/Scanner';
import Sections from './pages/Sections';
import Users from './pages/Users';
import Excuses from './pages/Excuses';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'admin')   return <AdminDashboard />;
  if (user?.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <A11yProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />

          <Route path="/" element={<Landing />} />

          <Route element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<RequireAuth roles={['teacher', 'admin']}><Scanner /></RequireAuth>} />
            <Route path="/sections" element={<RequireAuth roles={['teacher', 'admin']}><Sections /></RequireAuth>} />
            <Route path="/users" element={<RequireAuth roles={['admin']}><Users /></RequireAuth>} />
            <Route path="/excuses" element={<Excuses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<RequireAuth roles={['teacher', 'admin']}><Analytics /></RequireAuth>} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </A11yProvider>
  );
}

// Wrap nested routes inside Shell
function AppShell() {
  return <Shell><Outlet /></Shell>;
}

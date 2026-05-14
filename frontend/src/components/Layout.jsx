import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/',               icon: '▦',  label: 'Dashboard' },
  { to: '/departments',    icon: '🏢', label: 'Departments' },
  { to: '/doctors',        icon: '🩺', label: 'Doctors' },
  { to: '/patients',       icon: '👤', label: 'Patients' },
  { to: '/rooms',          icon: '🛏', label: 'Rooms' },
  { to: '/appointments',   icon: '📅', label: 'Appointments' },
  { to: '/medical-records',icon: '📋', label: 'Medical Records' },
  { to: '/medications',    icon: '💊', label: 'Medications' },
  { to: '/prescriptions',  icon: '📄', label: 'Prescriptions' },
  { to: '/admissions',     icon: '🏨', label: 'Admissions' },
  { to: '/bills',          icon: '💳', label: 'Bills' },
];

const titles = {
  '/':                'Dashboard',
  '/departments':     'Departments',
  '/doctors':         'Doctors',
  '/patients':        'Patients',
  '/rooms':           'Rooms',
  '/appointments':    'Appointments',
  '/medical-records': 'Medical Records',
  '/medications':     'Medications',
  '/prescriptions':   'Prescriptions',
  '/admissions':      'Admissions',
  '/bills':           'Bills',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'Hospital MS';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-icon">🏥</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">HospitalMS</span>
            <span className="sidebar-logo-sub">Management System</span>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <span className="topbar-badge">Hospital DB</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

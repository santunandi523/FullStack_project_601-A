import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navItems = [
    { to: '/admin', label: '📊 Dashboard', end: true },
    { to: '/admin/products', label: '📦 Products' },
    { to: '/admin/orders', label: '📋 Orders' },
    { to: '/admin/users', label: '👥 Users' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1rem', padding: '0 0.5rem' }}>
          Admin Panel
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            id={`admin-nav-${item.label.replace(/[^a-z]/gi, '').toLowerCase()}`}
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

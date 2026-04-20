import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/users'),
          api.get('/products?limit=100'),
        ]);
        const orders = ordersRes.data;
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        setStats({
          orders: orders.length,
          users: usersRes.data.length,
          products: productsRes.data.total,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statusColors = {
    pending: 'status-pending', processing: 'status-processing',
    shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled'
  };

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Welcome back, Admin</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Revenue', value: `₹${stats?.revenue?.toLocaleString('en-IN')}`, icon: '💰' },
          { label: 'Total Orders', value: stats?.orders, icon: '📦' },
          { label: 'Total Users', value: stats?.users, icon: '👥' },
          { label: 'Total Products', value: stats?.products, icon: '🛍️' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>
          Recent Orders
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>#{order._id.slice(-8).toUpperCase()}</td>
                <td>{order.user?.name || '—'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                <td style={{ fontWeight: 600 }}>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                <td><span className={`status-badge ${statusColors[order.status]}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

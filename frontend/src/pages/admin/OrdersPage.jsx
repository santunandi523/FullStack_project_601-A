import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import Loader from '../../components/Loader';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      addToast('Order status updated!', 'success');
      fetchOrders();
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  if (loading) return <Loader />;

  const statusColors = {
    pending: 'status-pending', processing: 'status-processing',
    shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled'
  };

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Orders</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{orders.length} total orders</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '0.82rem' }}>#{order._id.slice(-8).toUpperCase()}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{order.user?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                <td>{order.items.length} items</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                <td><span className={`status-badge ${statusColors[order.status]}`}>{order.status}</span></td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="sort-select"
                    style={{ width: 'auto', fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                    id={`order-status-${order._id}`}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import Loader from '../../components/Loader';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      addToast('User deleted', 'info');
      fetchUsers();
    } catch {
      addToast('Failed to delete user', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Users</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{users.length} registered users</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user.email}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700,
                    background: user.role === 'admin' ? 'rgba(108,99,255,0.2)' : 'rgba(67,230,181,0.1)',
                    color: user.role === 'admin' ? 'var(--accent-primary)' : 'var(--success)'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  {user.role !== 'admin' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)} id={`delete-user-${user._id}`}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import Loader from '../../components/Loader';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { addToast } = useToast();

  const emptyForm = { name: '', description: '', price: '', originalPrice: '', category: '', brand: '', stock: '', images: '', featured: false };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
      category: p.category?._id || '', brand: p.brand || '', stock: p.stock,
      images: p.images?.join(', ') || '', featured: p.featured || false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        addToast('Product updated!', 'success');
      } else {
        await api.post('/products', payload);
        addToast('Product created!', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      addToast('Product deleted', 'info');
      fetchProducts();
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Products</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{products.length} products</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} id="add-product-btn">+ Add Product</button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.images?.[0]} alt={p.name} style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', background: 'var(--bg-secondary)' }} />
                </td>
                <td style={{ fontWeight: 600, maxWidth: 200 }}>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>₹{p.price?.toLocaleString('en-IN')}</td>
                <td style={{ color: p.stock < 5 ? 'var(--error)' : 'var(--success)' }}>{p.stock}</td>
                <td>{p.rating?.toFixed(1)} ⭐</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)} id={`edit-product-${p._id}`}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} id={`delete-product-${p._id}`}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editProduct ? 'Edit Product' : 'Add Product'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required id="product-form-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required id="product-form-desc" />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required min="0" id="product-form-price" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input type="number" className="form-input" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} min="0" id="product-form-orig-price" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-input" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required min="0" id="product-form-stock" />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} id="product-form-brand" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required id="product-form-cat">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Image URLs (comma-separated)</label>
                <textarea className="form-textarea" rows={2} value={form.images} onChange={e => setForm({...form, images: e.target.value})} placeholder="https://..., https://..." id="product-form-images" />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" id="product-form-featured" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
                <label htmlFor="product-form-featured" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Featured Product</label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} id="product-form-submit">
                {editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

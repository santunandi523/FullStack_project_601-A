import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const shipping = cartTotal > 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const [form, setForm] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = cartItems.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.images?.[0] || '',
        price: i.price,
        quantity: i.qty,
      }));
      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: form,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      });
      clearCart();
      addToast('🎉 Order placed successfully!', 'success');
      navigate(`/orders`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Order failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container section fade-in">
      <h1 className="section-title" style={{ marginBottom: '2rem' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        <form onSubmit={handleOrder}>
          {/* SHIPPING */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>📦 Shipping Address</h2>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="checkout-name" className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input id="checkout-street" className="form-input" value={form.street} onChange={(e) => set('street', e.target.value)} required placeholder="123 Main Street, Apt 4B" />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input id="checkout-city" className="form-input" value={form.city} onChange={(e) => set('city', e.target.value)} required placeholder="Mumbai" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input id="checkout-state" className="form-input" value={form.state} onChange={(e) => set('state', e.target.value)} required placeholder="Maharashtra" />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input id="checkout-zip" className="form-input" value={form.zip} onChange={(e) => set('zip', e.target.value)} required placeholder="400001" />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input id="checkout-country" className="form-input" value={form.country} onChange={(e) => set('country', e.target.value)} required />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem' }}>💳 Payment Method</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Card', 'UPI', 'Net Banking', 'COD'].map((method) => (
                <label key={method} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem',
                  background: paymentMethod === method ? 'rgba(108,99,255,0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${paymentMethod === method ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500
                }}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} id={`payment-${method}`} style={{ display: 'none' }} />
                  {method === 'Card' ? '💳' : method === 'UPI' ? '📱' : method === 'Net Banking' ? '🏦' : '💵'} {method}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="place-order-btn">
            {loading ? 'Placing Order…' : '✅ Place Order'}
          </button>
        </form>

        {/* SUMMARY */}
        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>
              <span>{item.name} ×{item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px dashed var(--border-subtle)', marginTop: '1rem', paddingTop: '1rem' }}>
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
            <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

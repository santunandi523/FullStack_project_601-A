import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-state-icon">🔐</div>
          <div className="empty-state-title">Please login to view your cart</div>
          <div className="empty-state-text">Your cart is saved and will be waiting for you after login!</div>
          <Link to="/login" className="btn btn-primary" id="cart-login-btn">Login to Continue</Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <div className="empty-state-title">Your cart is empty</div>
          <div className="empty-state-text">Add some products to get started!</div>
          <Link to="/shop" className="btn btn-primary" id="cart-shop-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section fade-in">
      <h1 className="section-title" style={{ marginBottom: '2rem' }}>
        Shopping <span>Cart</span>
        <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.75rem' }}>({cartItems.length} items)</span>
      </h1>

      <div className="cart-layout">
        {/* ITEMS */}
        <div>
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200'}
                alt={item.name}
                className="cart-item-img"
              />
              <div>
                <Link to={`/product/${item._id}`} className="cart-item-name" style={{ display: 'block', marginBottom: '0.35rem' }}>{item.name}</Link>
                <div className="cart-item-price">₹{item.price?.toLocaleString('en-IN')} each</div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="qty-control" style={{ display: 'inline-flex' }}>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)} id={`cart-qty-dec-${item._id}`}>−</button>
                    <div className="qty-value">{item.qty}</div>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)} id={`cart-qty-inc-${item._id}`}>+</button>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-primary)' }}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => { removeFromCart(item._id); addToast('Item removed', 'info'); }} id={`remove-cart-${item._id}`}>Remove</button>
              </div>
            </div>
          ))}

          <button className="btn btn-secondary btn-sm" onClick={() => { clearCart(); addToast('Cart cleared', 'info'); }} style={{ marginTop: '0.5rem' }} id="clear-cart-btn">
            🗑️ Clear Cart
          </button>
        </div>

        {/* SUMMARY */}
        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? '🎉 Free' : `₹${shipping}`}</span></div>
          <div className="summary-row"><span>Tax (18% GST)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          {shipping > 0 && <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for FREE shipping!</div>}
          <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')} id="proceed-checkout-btn">
            Proceed to Checkout →
          </button>
          <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

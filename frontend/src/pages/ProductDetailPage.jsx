import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loader from '../components/Loader';

const Stars = ({ rating }) => {
  return <span className="stars">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    addToast(`"${product.name}" added to cart!`, 'success');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      addToast('Review submitted!', 'success');
      setReviewComment('');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container section fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* IMAGES */}
        <div>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem', background: 'var(--bg-secondary)' }}>
            <img
              src={product.images?.[activeImg] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600'}
              alt={product.name}
              style={{ width: '100%', height: 420, objectFit: 'cover' }}
            />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 72, height: 72, borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${activeImg === i ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem' }}>
            {product.category?.name}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '1rem', lineHeight: 1.3 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <Stars rating={product.rating} />
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{product.rating?.toFixed(1)}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>({product.numReviews} reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.1rem' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                <span className="price-discount" style={{ fontSize: '0.9rem' }}>{discount}% off</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
            </span>
          </div>

          {product.brand && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Brand: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.brand}</span></p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} id="qty-decrease-btn">−</button>
              <div className="qty-value">{qty}</div>
              <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))} id="qty-increase-btn">+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart} disabled={product.stock === 0} id="product-add-to-cart-btn">
              🛒 Add to Cart
            </button>
            <button
              className={`btn btn-secondary`}
              onClick={() => { if (!user) { addToast('Login to use wishlist', 'info'); return; } toggleWishlist(product._id); }}
              style={{ fontSize: '1.4rem', padding: '0.75rem 1rem' }}
              id="product-wishlist-btn"
            >
              {isInWishlist(product._id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Customer <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reviews</span></h2>

        {product.reviews?.length === 0 && <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>No reviews yet. Be the first!</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {product.reviews?.map((r) => (
            <div key={r._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <span style={{ color: 'var(--accent-gold)' }}>{'★'.repeat(r.rating)}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <div className="card" style={{ maxWidth: 560 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Write a Review</h3>
            <form onSubmit={handleReview}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select className="form-select" value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} id="review-rating-select">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-textarea" rows={3} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required placeholder="Share your experience..." id="review-comment-input" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview} id="submit-review-btn">
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

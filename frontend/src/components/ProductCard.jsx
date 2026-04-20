import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to add items to cart 🔐', 'info');
      return;
    }
    addToCart(product, 1);
    addToast(`"${product.name}" added to cart!`, 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { addToast('Please login to use wishlist', 'info'); return; }
    toggleWishlist(product._id);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="product-card-badge badge-sale">-{discount}%</span>}
        <button
          className={`product-card-wishlist ${isInWishlist(product._id) ? 'active' : ''}`}
          onClick={handleWishlist}
          title="Toggle Wishlist"
        >
          {isInWishlist(product._id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-card-category">
          {product.category?.name || 'Product'}
        </div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-rating">
          <Stars rating={product.rating || 0} />
          <span>({product.numReviews || 0})</span>
        </div>
        <div className="product-card-price">
          <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
          {discount > 0 && <span className="price-discount">{discount}% off</span>}
        </div>
        <div className="product-card-actions">
          <button
            className="btn btn-primary"
            style={{ flex: 1, fontSize: '0.82rem', padding: '0.55rem 1rem' }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            id={`add-to-cart-${product._id}`}
          >
            {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

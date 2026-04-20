import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <div className="empty-state-title">Login to view your wishlist</div>
          <Link to="/login" className="btn btn-primary" id="wishlist-login-btn">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section fade-in">
      <h1 className="section-title" style={{ marginBottom: '2rem' }}>My <span>Wishlist</span></h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤍</div>
          <div className="empty-state-title">Your wishlist is empty</div>
          <div className="empty-state-text">Save products you love for later!</div>
          <Link to="/shop" className="btn btn-primary" id="wishlist-shop-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

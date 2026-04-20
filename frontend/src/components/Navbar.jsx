import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">ShopVerse</Link>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink>
          {user && (
            <>
              <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
              <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''}>Wishlist</NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink>
          )}
        </div>

        <div className="navbar-actions">

          {/* ── Cart button: only visible when logged in ── */}
          {user && (
            <Link to="/cart" className="cart-btn" id="navbar-cart-btn">
              🛒
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                👤 {user.name.split(' ')[0]} ▾
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>📋 My Orders</Link>
                  <Link to="/wishlist" onClick={() => setDropdownOpen(false)}>❤️ Wishlist</Link>
                  <Link to="/cart" onClick={() => setDropdownOpen(false)}>🛒 My Cart</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>⚙️ Admin Panel</Link>
                  )}
                  <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-btn btn-outline">Login</Link>
              <Link to="/register" className="auth-btn btn-primary-grad">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

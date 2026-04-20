import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-logo">ShopVerse</div>
          <p className="footer-description">
            Your premium destination for electronics, fashion, home goods, and more. Shop with confidence and style.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Shop</div>
          <div className="footer-links">
            <Link to="/shop?category=electronics">Electronics</Link>
            <Link to="/shop?category=clothing">Clothing</Link>
            <Link to="/shop?category=home-garden">Home & Garden</Link>
            <Link to="/shop?category=sports">Sports</Link>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Account</div>
          <div className="footer-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Info</div>
          <div className="footer-links">
            <Link to="/">About Us</Link>
            <Link to="/">Contact</Link>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 ShopVerse. All rights reserved.</span>
        <span>Built with React & MongoDB Atlas</span>
      </div>
    </div>
  </footer>
);

export default Footer;

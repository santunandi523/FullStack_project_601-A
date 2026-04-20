import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories'),
        ]);
        setFeatured(featRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">⚡ New Arrivals Every Week</div>
            <h1 className="hero-title">
              Shop the Future,<br />
              <span className="gradient-text">Delivered Today</span>
            </h1>
            <p className="hero-subtitle">
              Discover thousands of premium products across electronics, fashion, home décor, and more — all at amazing prices.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg" id="hero-shop-now-btn">
                🛍️ Shop Now
              </Link>
              <Link to="/shop?sort=newest" className="btn btn-secondary btn-lg">
                New Arrivals →
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div>
                <div className="hero-stat-value">10K+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div>
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Brands</div>
              </div>
              <div>
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by <span>Category</span></h2>
              <p className="section-subtitle">Explore our wide range of product categories</p>
            </div>
            <Link to="/shop" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {categories.length === 0 && !loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No categories found. Run the seed script to add data.</p>
          ) : (
            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="category-card"
                  onClick={() => navigate(`/shop?category=${cat._id}`)}
                  id={`category-${cat.slug}`}
                >
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-card-overlay">
                    <div className="category-card-name">{cat.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured <span>Products</span></h2>
              <p className="section-subtitle">Hand-picked deals just for you</p>
            </div>
            <Link to="/shop" className="btn btn-secondary btn-sm">See All →</Link>
          </div>
          {loading ? <Loader /> : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="section-sm">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(255,101,132,0.15) 100%)',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 3rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
              🎉 Exclusive <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Member Deals</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Sign up today and get up to 30% off on your first order
            </p>
            <Link to="/register" className="btn btn-primary btn-lg" id="promo-signup-btn">Get Started Free →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes] = await Promise.all([api.get('/categories')]);
        setCategories(catRes.data);
      } catch {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', 12);
        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, search, minPrice, maxPrice, page]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  return (
    <div className="fade-in">
      <div className="container section">
        {/* TOP BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">All <span>Products</span></h1>
            <p className="section-subtitle">{total} products found</p>
          </div>
          <input
            type="text"
            placeholder="🔍 Search products..."
            defaultValue={search}
            className="filter-input"
            style={{ maxWidth: 300 }}
            onKeyDown={(e) => { if (e.key === 'Enter') setParam('search', e.target.value); }}
            id="shop-search-input"
          />
        </div>

        <div className="shop-layout">
          {/* FILTERS */}
          <aside className="filters-sidebar">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Filters</h3>

            <div className="filter-section">
              <div className="filter-title">Category</div>
              <div className="filter-options">
                <div className={`filter-option ${!category ? 'active' : ''}`} onClick={() => setParam('category', '')} >All Categories</div>
                {categories.map((cat) => (
                  <div key={cat._id} className={`filter-option ${category === cat._id ? 'active' : ''}`} onClick={() => setParam('category', cat._id)} id={`filter-cat-${cat.slug}`}>
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-title">Sort By</div>
              <select className="sort-select" value={sort} onChange={(e) => setParam('sort', e.target.value)} id="shop-sort-select">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="filter-section">
              <div className="filter-title">Price Range (₹)</div>
              <div className="price-range">
                <input type="number" placeholder="Min" className="filter-input" defaultValue={minPrice} onBlur={(e) => setParam('minPrice', e.target.value)} id="filter-min-price" />
                <span style={{ color: 'var(--text-muted)' }}>—</span>
                <input type="number" placeholder="Max" className="filter-input" defaultValue={maxPrice} onBlur={(e) => setParam('maxPrice', e.target.value)} id="filter-max-price" />
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => setSearchParams({})} id="clear-filters-btn">
              Clear Filters
            </button>
          </aside>

          {/* PRODUCTS */}
          <div>
            {loading ? <Loader /> : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No products found</div>
                <div className="empty-state-text">Try adjusting your filters or search terms</div>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* PAGINATION */}
                {pages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={page === 1} onClick={() => setParam('page', page - 1)}>‹</button>
                    {Array.from({ length: pages }, (_, i) => (
                      <button key={i + 1} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setParam('page', i + 1)}>{i + 1}</button>
                    ))}
                    <button className="page-btn" disabled={page === pages} onClick={() => setParam('page', page + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

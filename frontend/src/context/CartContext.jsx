import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // ─── Load cart when user logs in ───────────────────────────
  useEffect(() => {
    if (user) {
      loadCartFromDB();
    } else {
      // Clear cart immediately on logout
      setCartItems([]);
    }
  }, [user]);

  // Fetch cart from MongoDB
  const loadCartFromDB = async () => {
    setCartLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCartItems(data);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  // ─── Add to cart ────────────────────────────────────────────
  const addToCart = async (product, qty = 1) => {
    if (!user) return;

    // Optimistic UI update
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: Math.min(item.qty + qty, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, qty }];
    });

    // Sync to DB
    try {
      const existing = cartItems.find((item) => item._id === product._id);
      const newQty = existing ? Math.min(existing.qty + qty, product.stock) : qty;
      await api.put(`/cart/${product._id}`, { qty: newQty });
    } catch {
      loadCartFromDB(); // rollback on error
    }
  };

  // ─── Remove from cart ───────────────────────────────────────
  const removeFromCart = async (id) => {
    if (!user) return;
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    try {
      await api.delete(`/cart/${id}`);
    } catch {
      loadCartFromDB();
    }
  };

  // ─── Update quantity ────────────────────────────────────────
  const updateQty = async (id, qty) => {
    if (!user) return;
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty } : item))
    );
    try {
      await api.put(`/cart/${id}`, { qty });
    } catch {
      loadCartFromDB();
    }
  };

  // ─── Clear cart ─────────────────────────────────────────────
  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await api.delete('/cart');
      } catch {}
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

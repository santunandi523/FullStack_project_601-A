const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user's cart from DB
// @route   GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  // Map to flat product objects with qty
  const cartItems = user.cart
    .filter((item) => item.product) // skip any null refs
    .map((item) => ({
      ...item.product.toObject(),
      qty: item.qty,
    }));
  res.json(cartItems);
});

// @desc    Sync entire cart to DB (called on login)
// @route   POST /api/cart/sync
const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ _id, qty }]
  const user = await User.findById(req.user._id);

  if (items && items.length > 0) {
    // Merge: items from client override DB items
    for (const clientItem of items) {
      const existing = user.cart.find(
        (c) => c.product.toString() === clientItem._id
      );
      if (existing) {
        existing.qty = clientItem.qty;
      } else {
        user.cart.push({ product: clientItem._id, qty: clientItem.qty });
      }
    }
    await user.save();
  }

  // Return populated cart
  await user.populate('cart.product');
  const cartItems = user.cart
    .filter((item) => item.product)
    .map((item) => ({ ...item.product.toObject(), qty: item.qty }));
  res.json(cartItems);
});

// @desc    Add or update a single cart item
// @route   PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const user = await User.findById(req.user._id);
  const existing = user.cart.find(
    (c) => c.product.toString() === req.params.productId
  );
  if (existing) {
    if (qty <= 0) {
      user.cart = user.cart.filter(
        (c) => c.product.toString() !== req.params.productId
      );
    } else {
      existing.qty = qty;
    }
  } else if (qty > 0) {
    user.cart.push({ product: req.params.productId, qty });
  }
  await user.save();
  res.json({ message: 'Cart updated' });
});

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:productId
const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (c) => c.product.toString() !== req.params.productId
  );
  await user.save();
  res.json({ message: 'Item removed from cart' });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, syncCart, updateCartItem, removeCartItem, clearCart };

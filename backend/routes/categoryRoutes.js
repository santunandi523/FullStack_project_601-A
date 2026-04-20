const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
}));

router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { name, slug, image, description } = req.body;
  const category = await Category.create({ name, slug, image, description });
  res.status(201).json(category);
}));

router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  await category.deleteOne();
  res.json({ message: 'Category removed' });
}));

module.exports = router;

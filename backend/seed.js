const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', description: 'Gadgets and devices' },
  { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', description: 'Fashion and apparel' },
  { name: 'Home & Garden', slug: 'home-garden', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400', description: 'Home decor and furniture' },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', description: 'Sports and fitness' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', description: 'Books and stationery' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', description: 'Beauty and personal care' },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create your personal admin account
  const santu = await User.create({
    name: 'Santu',
    email: 'santunandi523@gmail.com',
    password: '123456789',
    role: 'admin',
  });



  // Create categories
  const createdCategories = await Category.insertMany(categories);
  console.log(`📂 ${createdCategories.length} categories created`);

  const catMap = {};
  createdCategories.forEach((c) => { catMap[c.slug] = c._id; });

  // Create products
  const products = [
    {
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Premium sound quality with active noise cancellation. 30-hour battery life, foldable design, and comfortable over-ear cushions perfect for travel and work.',
      price: 2999,
      originalPrice: 4999,
      category: catMap['electronics'],
      brand: 'SoundPro',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600'],
      stock: 50,
      featured: true,
      rating: 4.5,
      numReviews: 128,
      tags: ['electronics', 'audio', 'headphones'],
    },
    {
      name: 'Smartphone Pro Max 256GB',
      description: 'The latest flagship smartphone with a stunning 6.7" AMOLED display, 200MP camera system, 5G connectivity, and all-day battery life.',
      price: 79999,
      originalPrice: 89999,
      category: catMap['electronics'],
      brand: 'TechBrand',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600'],
      stock: 30,
      featured: true,
      rating: 4.8,
      numReviews: 256,
      tags: ['electronics', 'smartphone', 'mobile'],
    },
    {
      name: '4K Ultra HD Smart TV 55"',
      description: 'Crystal-clear 4K display with HDR10+, built-in streaming apps, voice control, and a sleek bezel-less design for an immersive viewing experience.',
      price: 49999,
      originalPrice: 65000,
      category: catMap['electronics'],
      brand: 'VisionMax',
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600'],
      stock: 15,
      featured: true,
      rating: 4.6,
      numReviews: 89,
      tags: ['electronics', 'tv', 'smart-tv'],
    },
    {
      name: 'Laptop Gaming Beast 16"',
      description: 'High-performance gaming laptop with RTX 4070, Intel i9 processor, 32GB RAM, 1TB NVMe SSD, and 165Hz QHD display.',
      price: 119999,
      originalPrice: 135000,
      category: catMap['electronics'],
      brand: 'GameForce',
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'],
      stock: 10,
      featured: false,
      rating: 4.7,
      numReviews: 64,
      tags: ['electronics', 'laptop', 'gaming'],
    },
    {
      name: 'Men\'s Classic Slim Fit Suit',
      description: 'Elegant slim-fit suit crafted from premium wool blend. Perfect for formal occasions, featuring a two-button closure and a modern cut.',
      price: 7999,
      originalPrice: 12000,
      category: catMap['clothing'],
      brand: 'EliteWear',
      images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600'],
      stock: 40,
      featured: true,
      rating: 4.3,
      numReviews: 45,
      tags: ['clothing', 'formal', 'men'],
    },
    {
      name: 'Women\'s Summer Floral Dress',
      description: 'Lightweight and breezy floral print dress, perfect for summer outings. Made from 100% breathable cotton with a flattering A-line silhouette.',
      price: 1499,
      originalPrice: 2500,
      category: catMap['clothing'],
      brand: 'BloomStyle',
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'],
      stock: 80,
      featured: true,
      rating: 4.4,
      numReviews: 112,
      tags: ['clothing', 'women', 'summer'],
    },
    {
      name: 'Modern Nordic Sofa 3-Seater',
      description: 'Scandinavian-inspired 3-seater sofa with solid wood legs and premium fabric upholstery. Available in multiple colors.',
      price: 34999,
      originalPrice: 45000,
      category: catMap['home-garden'],
      brand: 'NordicHome',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
      stock: 8,
      featured: true,
      rating: 4.5,
      numReviews: 38,
      tags: ['home', 'furniture', 'sofa'],
    },
    {
      name: 'Professional Yoga Mat Premium',
      description: '6mm thick non-slip yoga mat with alignment lines, eco-friendly TPE material, carrying strap included. Perfect for home and studio use.',
      price: 2499,
      originalPrice: 3500,
      category: catMap['sports'],
      brand: 'ZenFit',
      images: ['https://images.unsplash.com/photo-1601925228685-7e5e46be6b35?w=600'],
      stock: 100,
      featured: false,
      rating: 4.6,
      numReviews: 203,
      tags: ['sports', 'yoga', 'fitness'],
    },
    {
      name: 'Stainless Steel Water Bottle 1L',
      description: 'Double-walled insulated water bottle that keeps drinks cold for 24hrs or hot for 12hrs. BPA-free, leak-proof lid, perfect for outdoor adventures.',
      price: 999,
      originalPrice: 1500,
      category: catMap['sports'],
      brand: 'HydroMax',
      images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
      stock: 200,
      featured: false,
      rating: 4.7,
      numReviews: 318,
      tags: ['sports', 'outdoor', 'hydration'],
    },
    {
      name: 'Scented Luxury Candle Set',
      description: 'Set of 3 hand-poured soy wax candles with calming lavender, vanilla, and eucalyptus scents. 45+ hours burn time each.',
      price: 1299,
      originalPrice: 2000,
      category: catMap['home-garden'],
      brand: 'AromaLux',
      images: ['https://images.unsplash.com/photo-1602874801007-bd458bb1b2e7?w=600'],
      stock: 60,
      featured: false,
      rating: 4.8,
      numReviews: 156,
      tags: ['home', 'candles', 'decor'],
    },
    {
      name: 'Wireless Mechanical Keyboard',
      description: 'Compact 75% wireless mechanical keyboard with RGB backlighting, brown switches for tactile feedback, and 100-hour battery life.',
      price: 5999,
      originalPrice: 8500,
      category: catMap['electronics'],
      brand: 'TypeMaster',
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
      stock: 35,
      featured: false,
      rating: 4.5,
      numReviews: 87,
      tags: ['electronics', 'keyboard', 'gaming'],
    },
    {
      name: 'Luxury Face Moisturizer SPF50',
      description: 'Dermatologist-tested daily moisturizer with SPF50 sun protection, hyaluronic acid, and vitamin C for radiant, youthful skin.',
      price: 1899,
      originalPrice: 2800,
      category: catMap['beauty'],
      brand: 'GlowSkin',
      images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'],
      stock: 150,
      featured: true,
      rating: 4.6,
      numReviews: 234,
      tags: ['beauty', 'skincare', 'moisturizer'],
    },
  ];

  const createdProducts = await Product.insertMany(products);
  console.log(`📦 ${createdProducts.length} products created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login: santunandi523@gmail.com / 123456789');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});

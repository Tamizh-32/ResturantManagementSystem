const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Store = require('../models/store');
const Category = require('../models/category');
const multer = require('multer');
const flash = require('connect-flash');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Product List
router.get('/products', async (req, res) => {
  try {
    const product = await Product.find({})
    .populate('categoryId', 'categoryName') // Populate categoryId with categoryName
    .populate('storeId', 'storeName');     // Populate storeId with storeName
    res.render('./products/productList', { product });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch Store and Category IDs from their respective collections
router.get('/products/add', async (req, res) => {
  try {
    const stores = await Store.find({}); // Fetch all stores
    const categories = await Category.find({}); // Fetch all categories
    res.render('./products/addProduct', { stores, categories }); // Pass both datasets to the template
  } catch (err) {
    console.error('Error fetching stores or categories:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add Product
router.post('/products', upload.single('image'), async (req, res) => {
  const { productName, price, description, categoryId, storeId,status } = req.body;
  const image = `/uploads/${req.file.filename}`;
  try {
    await Product.create({ productName, image, price, description, categoryId, storeId,status });
    req.flash('successMessage', 'Product added successfully!');
    res.redirect('/products');
  } catch (err) {
    console.error('Error adding product:', err);
    req.flash('errorMessage', 'Failed to add product. Please try again.');
    res.redirect('/products/add');
  }
});

// Edit Product Route Placeholder
router.get('/products/edit/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const stores = await Store.find({}); // Fetch all stores
      const categories = await Category.find({}); // Fetch all categories
      res.render('./products/editProduct', { product, stores, categories });
    } catch (err) {
      console.error('Error fetching product, stores, or categories:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  


 // update Product PUT
  
 router.put('/products/:id', upload.single('image'), async (req, res) => {
    const { productName, price, description, categoryId, storeId,status  } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage;
    try {
        await Product.findByIdAndUpdate(req.params.id, { productName, image, price, description, categoryId, storeId,status});
        req.flash('successMessage', 'Product  Updated successfully!');
        res.redirect('/products');
      } catch (err) {
        req.flash('errorMessage', 'Failed to Update Product. Please try again.');
        res.redirect(`/products/edit/${req.params.id}`);
      }
  });

 

// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Product Deleted successfully!');
        res.redirect('/products');
      } catch (err) {
        req.flash('errorMessage', 'Failed to Delete Product. Please try again.');
        res.redirect('/products');
      }
  });
  


module.exports = router;

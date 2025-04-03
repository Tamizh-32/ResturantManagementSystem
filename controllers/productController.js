const {Product,activeEnum} = require('../models/productModel');
const {Store} = require('../models/storeModel');
const {Category} = require('../models/categoriesModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object


// Product List
exports.getProductList = async (req, res) => {
  try {
    const companyInfo = req.companyInfo;
    const storeId = req.storeId;
    const product = await Product.find({storeId})
      .populate('categoryId', 'categoryName') // Populate categoryId with categoryName
      .populate('storeId', 'storeName');     // Populate storeId with storeName
    res.render('./components/products/productList', {
      product,
      title: 'MENUS LIST',companyInfo
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Fetch Store and Category IDs for Add Product Page
exports.getAddProduct = async (req, res) => {
  try {
    const storeId= req.storeId;
    const companyInfo = req.companyInfo;
    const stores = await Store.find({status: "active",storeId}); // Fetch all stores
    const categories = await Category.find({status: "active",storeId}); // Fetch all categories
    res.render('./components/products/addProduct', { stores, categories,activeEnum,companyInfo });
  } catch (err) {
    console.error('Error fetching stores or categories:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Add Product
exports.postAddProduct = async (req, res) => {
  const { productName, price, description, categoryId, status } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const storeId = req.storeId;
  try {
    await Product.create({ productName, image, price, description, categoryId, storeId, status });
    req.flash('successMessage', 'Product added successfully!');
    res.redirect('/products');
  } catch (err) {
    console.error('Error adding product:', err);
    req.flash('errorMessage', 'Failed to add product. Please try again.');
    res.redirect('/products/add');
  }
};

// Get Edit Product Page
exports.getEditProduct = async (req, res) => {
  try {
    const companyInfo = req.companyInfo;
    const storeId= req.storeId;
    const product = await Product.findById(req.params.id);
    const stores = await Store.find({status:"active"}); // Fetch all stores
    const categories = await Category.find({status:"active",storeId}); // Fetch all categories
    res.render('./components/products/editProduct', { product, stores, categories,activeEnum,companyInfo });
  } catch (err) {
    console.error('Error fetching product, stores, or categories:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Update Product
exports.putEditProduct = async (req, res) => {
  const { productName, price, description, categoryId, status } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage;
  const storeId = req.storeId;
  try {
    await Product.findByIdAndUpdate(req.params.id, { productName, image, price, description, categoryId, storeId, status });
    req.flash('successMessage', 'Product Updated successfully!');
    res.redirect('/products');
  } catch (err) {
    req.flash('errorMessage', 'Failed to Update Product. Please try again.');
    res.redirect(`/products/edit/${req.params.id}`);
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('successMessage', 'Product Deleted successfully!');
    res.redirect('/products');
  } catch (err) {
    req.flash('errorMessage', 'Failed to Delete Product. Please try again.');
    res.redirect('/products');
  }
};

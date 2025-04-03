const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protectData } = require('../controllers/authController');

const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// List Categories
router.get('/categories', categoryController.getCategories);

// Add Category - GET
router.get('/categories/add', categoryController.getAddCategory);

// Add Category - POST
router.post('/categories', categoryController.postAddCategory);

// Edit Category - GET
router.get('/categories/edit/:id', categoryController.getEditCategory);

// Edit Category - PUT
router.put('/categories/:id', categoryController.putEditCategory);

// Delete Category
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
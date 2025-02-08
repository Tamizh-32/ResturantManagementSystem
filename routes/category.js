
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const path=require('path');
const flash=require('connect-flash');

// List Categories
router.get('/category', async (req, res) => {
  try {
    const category = await Category.find({});
    res.render('./components/category/categoryList', {
      title: 'CATEGORY LIST',
      category,
    });
  } catch (err) {
    req.flash('errorMessage', 'Failed to load categories.');
    res.redirect('/');
  }
});

// Add Category Form
router.get('/category/add', (req, res) => {
  res.render('./components/category/addCategory', {
    title: 'Add Category',
  });
});

// Add Category (POST)
router.post('/category', async (req, res) => {
  const { categoryName, status } = req.body;
  try {
    await Category.create({ categoryName, status });
    req.flash('successMessage', 'Category added successfully!');
    res.redirect('/category');
  } catch (err) {
    console.error('Error adding category:', err);
    req.flash('errorMessage', 'Failed to add category. Please try again.');
    res.redirect('/category/add');
  }
});

// Edit Category Form
router.get('/category/edit/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render('./components/category/editCategory', { category });
  } catch (err) {
    req.flash('errorMessage', 'Failed to load category.');
    res.redirect('/category');
  }
});

// Edit Category (PUT)
router.put('/category/:id', async (req, res) => {
  const { categoryName, status } = req.body;
  try {
    await Category.findByIdAndUpdate(req.params.id, { categoryName, status });
    req.flash('successMessage', 'Category updated successfully!');
    res.redirect('/category');
  } catch (err) {
    console.error('Error updating category:', err);
    req.flash('errorMessage', 'Failed to update category. Please try again.');
    res.redirect(`/category/edit/${req.params.id}`);
  }
});

// Delete Category (DELETE)
router.delete('/category/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('successMessage', 'Category deleted successfully!');
    res.redirect('/category');
  } catch (err) {
    console.error('Error deleting category:', err);
    req.flash('errorMessage', 'Failed to delete category. Please try again.');
    res.redirect('/category');
  }
});

module.exports = router;


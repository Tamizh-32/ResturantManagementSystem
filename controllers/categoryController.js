const {Category,activeEnum} = require('../models/categoriesModel');
const {Store} = require('../models/storeModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object
const { CompanyInfo } = require('../models/companyInfoModel');



// categoryController.js
exports.getCategories = async (req, res) => {
    try {
        const storeId = req.storeId; // Get storeId from the request object
        const categories = await Category.find({ storeId }).populate('storeId');
        const companyInfo = req.companyInfo; // Access companyInfo from the request object

        res.render('./components/categories/categoryList', { 
            title: 'CATEGORY LIST', 
            categories, 
            companyInfo 
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("An error occurred while fetching categories.");
    }
};

// Fetch Stores for Add Category
exports.getAddCategory = async (req, res) => {
    try {
        const companyInfo = req.companyInfo; // Access companyInfo from the request object
        const stores = await Store.find({status:"active"});
        res.render('./components/categories/addCategory', { stores,activeEnum,companyInfo });
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
};

// Add Category
exports.postAddCategory = async (req, res) => {
    const { categoryName, status } = req.body;
    const storeId = req.storeId; // Get storeId from the request object
    try {
        
        await Category.create({ categoryName, status, storeId });
        req.flash('successMessage', 'Category added successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error adding category:", error);
        req.flash('errorMessage', 'Failed to add category. Please try again.');
        res.redirect('/categories/add');
    }
};

// Edit Category - GET
exports.getEditCategory = async (req, res) => {
    try {
        const companyInfo = req.companyInfo; // Access companyInfo from the request object
        const category = await Category.findById(req.params.id);
        const stores = await Store.find({status:"active"});
        res.render('./components/categories/editCategory', { category, stores,activeEnum ,companyInfo});
    } catch (error) {
        console.error('Error fetching category or stores:', error);
        req.flash('error', 'Failed to load data for editing.');
        res.redirect('/categories');
    }
};

// Edit Category - PUT
exports.putEditCategory = async (req, res) => {
    const { categoryName, status } = req.body;
    const storeId = req.storeId; // Get storeId from the request object
    try {
        await Category.findByIdAndUpdate(req.params.id, { categoryName, status, storeId });
        req.flash('successMessage', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error updating category:", error);
        req.flash('errorMessage', 'Failed to update category. Please try again.');
        res.redirect(`/categories/edit/${req.params.id}`);
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Category deleted successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error deleting category:", error);
        req.flash('errorMessage', 'Failed to delete category. Please try again.');
        res.redirect('/categories');
    }
};

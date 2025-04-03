const {Store,activeEnum} = require('../models/storeModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object

// List Stores

exports.getStoreList = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const stores = await Store.find(); // Only fetch active stores
        console.log("Stores:", stores);
        res.render('./components/stores/storeList', {
            stores,
            title: 'STORE LIST',companyInfo
        });
    } catch (err) {
        console.error('Error fetching stores:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Render Add Store Page
exports.getAddStore =async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        res.render('./components/stores/addStore', { 
            activeEnum, // Pass the enum values for active
            title: 'ADD STORE',companyInfo
        });
        
    } catch (error) {
        console.error('Error fetching menus:', err);
        res.status(500).send('Internal Server Error');
    }

};

// Add Store (POST request)
exports.postAddStore = async (req, res) => {
    const { storeName, status } = req.body;
    try {

        const newStore = await Store.create({ storeName, status });
        req.flash('successMessage', 'Store added successfully!');
        res.redirect('/stores');
        // res.status(201).json(newStore); 
    } catch (err) {
        console.error('Error adding store:', err);
        req.flash('errorMessage', 'Failed to add store. Please try again.');
        res.redirect('/stores/add');
    }
};





// Render Edit Store Page
exports.getEditStore = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const store = await Store.findById(req.params.id);
        res.render('./components/stores/editStore', {
            store,
            activeEnum, // Pass the enum values for active
            title: 'ADD STORE',companyInfo
         });
    } catch (err) {
        console.error('Error fetching store:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Update Store (PUT request)
exports.putEditStore = async (req, res) => {
    const { storeName, status } = req.body;
    try {
        await Store.findByIdAndUpdate(req.params.id, { storeName, status });
        req.flash('successMessage', 'Store updated successfully!');
        res.redirect('/stores');
    } catch (err) {
        console.error('Error updating store:', err);
        req.flash('errorMessage', 'Failed to update store. Please try again.');
        res.redirect(`/stores/edit/${req.params.id}`);
    }
};

// Delete Store
exports.deleteStore = async (req, res) => {
    try {
        await Store.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Store deleted successfully!');
        res.redirect('/stores');
        // res.json({ status: "success", message: "Store deleted successfully." });
    } catch (err) {
        console.error('Error deleting store:', err);
        req.flash('errorMessage', 'Failed to delete store. Please try again.');
        res.redirect('/stores');
    }
};

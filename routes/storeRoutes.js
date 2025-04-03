const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protectData } = require('../controllers/authController');
const storeValidation = require('../middleware/storeValidation'); // Import the storeValidation middleware
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// Store Routes with Authentication & Authorization
router.get('/stores', protectData, storeController.getStoreList);               // Protected: Get store list
router.get('/stores/add', protectData, storeController.getAddStore);           // Protected: Get add store form
router.post('/stores', protectData, storeController.postAddStore);             // Protected: Add store
router.get('/stores/edit/:id', protectData, storeController.getEditStore);     // Protected: Get edit store form
router.put('/stores/:id', protectData, storeController.putEditStore);          // Protected: Edit store
router.delete('/stores/:id', protectData, storeController.deleteStore);        // Protected + Admin Access Control: Delete store

// New Route: Store-specific dashboard
router.get('/stores/:storeId/dashboard', protectData, storeValidation, (req, res) => {
  res.render('dashboard', { storeId: req.storeId });
});

module.exports = router;
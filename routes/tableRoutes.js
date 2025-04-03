const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { protectData } = require('../controllers/authController');
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// List Tables
router.get('/tables', protectData, tableController.getTables);

// Fetch Store ID & Render Add Table Page
router.get('/tables/add',protectData,  tableController.getAddTable);

// Add Table (POST request)
router.post('/tables', protectData, tableController.postAddTable);

// Edit Table Page
router.get('/tables/edit/:id',protectData,  tableController.getEditTable);

// Edit Table (PUT request)
router.put('/tables/:id', protectData, tableController.putEditTable);

// Delete Table
router.delete('/tables/:id',protectData,  tableController.deleteTable);

module.exports = router;

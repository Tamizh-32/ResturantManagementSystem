const express = require('express');
const router = express.Router();
const tableStatusController = require('../controllers/tableStatusController');
const { protectData } = require('../controllers/authController');
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// List Table Status
router.get('/tablestatus',protectData,  tableStatusController.listTableStatus);

// Add Table Status Page
router.get('/tablestatus/add',protectData,  tableStatusController.renderAddTableStatus);

// Add Table Status (POST)
router.post('/tablestatus', protectData, tableStatusController.addTableStatus);

// Edit Table Status Page
router.get('/tablestatus/edit/:id', protectData, tableStatusController.renderEditTableStatus);

// Update Table Status (PUT)
router.put('/tablestatus/:id', protectData, tableStatusController.updateTableStatus);

// Delete Table Status (DELETE)
router.delete('/tablestatus/:id',protectData,  tableStatusController.deleteTableStatus);

module.exports = router;

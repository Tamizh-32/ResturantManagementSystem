const express = require('express');
const router = express.Router();
const roleController= require('../controllers/roleController');
const { protectData } = require('../controllers/authController');
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// Order Status Routes
router.get('/roles',protectData,   roleController.getRoleList);
router.get('/roles/add',protectData,   roleController.getAddRole);
router.post('/roles',protectData,   roleController.postAddRole);
router.get('/roles/edit/:id',protectData,  roleController.getEditRole);
router.put('/roles/:id', protectData,  roleController.putEditRole);
router.delete('/roles/:id', protectData, roleController.deleteRole);

module.exports = router;

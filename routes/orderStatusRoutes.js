const express = require('express');
const router = express.Router();
const orderStatusController = require('../controllers/orderStatusContorller');
const { protectData } = require('../controllers/authController');

const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// Order Status Routes
router.get('/orderstatus',protectData,  orderStatusController.getOrderStatusList);
router.get('/orderStatus/add',protectData  ,orderStatusController.getAddOrderStatus);
router.post('/orderstatus',protectData,  orderStatusController.postAddOrderStatus);
router.get('/orderstatus/edit/:id',protectData, orderStatusController.getEditOrderStatus);
router.put('/orderstatus/:id',protectData,  orderStatusController.putEditOrderStatus);
router.delete('/orderstatus/:id', protectData, orderStatusController.deleteOrderStatus);

module.exports = router;

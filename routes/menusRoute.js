const express = require('express');
const router = express.Router();
const menusController= require('../controllers/menuController');
const { protectData } = require('../controllers/authController');
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// Order Status Routes
router.get('/menus',protectData,  menusController.getMenuList);
router.get('/menus/add',protectData,   menusController.getAddMenu);
router.post('/menus', protectData,  menusController.postAddMenu);
router.get('/menus/edit/:id',protectData,  menusController.getEditMenu);
router.put('/menus/:id',protectData,   menusController.putEditMenu);
router.delete('/menus/:id',protectData,  menusController.deleteMenu);

module.exports = router;

const express = require('express');
const notificationController = require('../controllers/notficationController');
const router = express.Router();
const navbarController = require('../controllers/navbarController');
const { protectData } = require('../controllers/authController');

const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

router.get('/navbar', protectData, navbarController.getNavbarList);

module.exports = router;
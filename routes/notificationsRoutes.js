const express = require('express');
const notificationController = require('../controllers/notficationController');
const router = express.Router();
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(fetchCompanyInfo);

router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:notificationId/read', notificationController.markNotificationAsRead);

module.exports = router;
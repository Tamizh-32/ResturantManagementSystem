// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protectData } = require('../controllers/authController');
const Notification = require('../models/notificationModel');
const { Product } = require('../models/productModel'); // Add this line
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

router.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find({ status: 'unread' })
            .sort({ createdAt: -1 })
            .populate({
                path: 'orderId',
                select: 'customerName tableId', // Include customerName and tableId
                populate: {
                    path: 'tableId', // Populate the tableId to get the tableName
                    select: 'tableName',
                },
            });

        // Format the notifications to include tableName and customerName
        const formattedNotifications = notifications.map(notification => ({
            _id: notification._id,
            message: notification.message,
            orderId: notification.orderId ? notification.orderId._id : null,
            customerName: notification.orderId ? notification.orderId.customerName : 'Unknown',
            tableName: notification.orderId && notification.orderId.tableId ? notification.orderId.tableId.tableName : 'Unknown',
            status: notification.status,
            createdAt: notification.createdAt,
        }));

        res.json({ count: notifications.length, notifications: formattedNotifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});
 // routes/notificationRoutes.js or routes/orderRoutes.js
router.put('/notifications/:id/read', async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { status: 'read' },
        { new: true }
      );
      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, message: 'Error marking notification as read' });
    }
  });


// List Orders
router.get('/orders',protectData,  orderController.listOrders);

// Show form to add a new order
router.get('/orders/add', protectData, orderController.showAddOrderForm);

// Create Order
router.post('/orders',protectData,  orderController.createOrder);

// Edit Order
router.get('/orders/edit/:id',protectData,  orderController.showEditOrderForm);

// Update Order
router.put('/orders/:id', protectData, orderController.updateOrder);

// Delete Order
router.delete('/orders/:id',protectData,  orderController.deleteOrder);

// View Order Details
router.get('/orders/view/:id',protectData,  orderController.viewOrder);

module.exports = router;

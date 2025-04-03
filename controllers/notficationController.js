const Notification = require('../models/notificationModel');
const {Order} = require('../models/orderModel'); // Import the Order model

exports.getNotifications = async (req, res) => {
    try {
        const storeId = req.session.storeId; // Get storeId from session
        console.log('Notification StoreId: ', storeId);
        if (!storeId) {
            return res.status(400).json({ success: false, message: "Store ID is required" });
        }
        const notifications = await Notification.find({ storeId, status: 'unread' });

        // Fetch customerName for each notification from the order collection
        const formattedNotifications = await Promise.all(
          notifications.map(async (notification) => {
              const order = await Order.findById(notification.orderId).select('customerName');
              return {
                  ...notification.toObject(),
                  customerName: order ? order.customerName : 'Unknown',
              };
          })
      );
        res.json({ success: true, count: formattedNotifications.length,notifications: formattedNotifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        console.log("NotificationId: ",notificationId);
        const notification = await Notification.findByIdAndUpdate(notificationId, { status: 'read' }, { new: true });
        console.log("Notification: ",notification);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
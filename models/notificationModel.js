const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  storeId: { type:mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
});

applyTimestamps(notificationSchema);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
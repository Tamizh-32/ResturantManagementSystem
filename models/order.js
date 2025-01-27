const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps');
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  email: { type: String },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true },
    rate: { type: Number },
    amount: { type: Number }
  }],
  grossAmount: { type: Number },
  taxAmount: { type: Number },
  discount: { type: Number },
  netAmount: { type: Number },
  description: { type: String },  
  orderstatusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orderstatus' },
  
});

// Apply timestamps
applyTimestamps(orderSchema);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;


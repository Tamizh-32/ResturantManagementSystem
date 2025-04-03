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
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model
  // companyInfoId: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyInfo', required: true }, // Reference to CompanyInfo model
  status:{ type: String,
    enum: ["active", "inactive"]
}
});

// Apply timestamps
applyTimestamps(orderSchema);
const Order = mongoose.model('Order', orderSchema);
module.exports = {Order,
  activeEnum: orderSchema.path('status').enumValues, // Extract enum values for active
};


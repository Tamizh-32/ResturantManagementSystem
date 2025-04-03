const mongoose = require('mongoose');
const applyTimestamps=require('../utils/timestamps');
const orderStatusSchema = new mongoose.Schema({
    statusName:{type:String, required:true},
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model
    status:{ type: String,
        enum: ["active", "inactive"]
    }
});

applyTimestamps(orderStatusSchema);

const Orderstatus = mongoose.model('Orderstatus', orderStatusSchema);
module.exports = {Orderstatus,
    activeEnum: orderStatusSchema.path('status').enumValues, // Extract enum values for active
};
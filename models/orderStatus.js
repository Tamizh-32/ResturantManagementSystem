const mongoose = require('mongoose');
const applyTimestamps=require('../utils/timestamps');
const orderStatusSchema = new mongoose.Schema({
    statusName:{type:String, required:true},
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model

});

applyTimestamps(orderStatusSchema);

const Orderstatus = mongoose.model('Orderstatus', orderStatusSchema);
module.exports = Orderstatus;
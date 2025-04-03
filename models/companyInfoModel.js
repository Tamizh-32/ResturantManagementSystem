const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file
const { activeEnum } = require('./storeModel');

const companyInfoSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyCode: { type: String, required: true },
  chargeAmount:{type:String, required: true},
  vatCharge:{type:String, required:true},
  gstno:{type:String, required:true},
  description:{type:String, required:true},
  email: { type: String, required: true },
  contact: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  status: { type: String, required: true },
  logo:{type:String,required:true},
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model
  status:{ type: String,
    enum: ["active", "inactive"]
}
});


// Apply timestamps
applyTimestamps(companyInfoSchema);

const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);
module.exports = {CompanyInfo,
  activeEnum: companyInfoSchema.path('status').enumValues, // Extract enum values for active
};

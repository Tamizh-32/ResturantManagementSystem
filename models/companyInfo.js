const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file

const companyInfoSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyCode: { type: String, required: true },
  chargeAmount:{type:String, required: true},
  vatCharge:{type:String, required:true},
  description:{type:String, required:true},
  email: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, required: true },
});


// Apply timestamps
applyTimestamps(companyInfoSchema);

const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);
module.exports = CompanyInfo;

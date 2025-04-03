const {CompanyInfo} = require('../models/companyInfoModel');

module.exports = async (req, res, next) => {
  try {
    const company = await CompanyInfo.findOne(); // Fetch company info from DB
    res.locals.companyinfo = company || {}; // Make it available globally
  } catch (error) {
    console.error("Error fetching company info:", error);
    res.locals.companyinfo = {}; // Set empty object if an error occurs
  }
  next();
};
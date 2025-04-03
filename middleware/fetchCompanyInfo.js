// fetchCompanyInfo.js
const { CompanyInfo } = require('../models/companyInfoModel');

exports.fetchCompanyInfo = async (req, res, next) => {
    try {
        const storeId = req.storeId; // Get storeId from the request object

        if (!storeId) {
            return res.status(400).send("Store ID is missing. Please log in again.");
        }

        // Fetch company info based on storeId
        const companyInfo = await CompanyInfo.findOne({ storeId });

        if (!companyInfo) {
            return res.status(404).send("Company info not found for the given store.");
        }

        // Attach companyInfo to the request object
        req.companyInfo = companyInfo;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error fetching company info:", error);
        res.status(500).send("An error occurred while fetching company info.");
    }
};
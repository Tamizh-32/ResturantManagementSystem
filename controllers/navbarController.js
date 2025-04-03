const { Store } = require('../models/storeModel');
const { CompanyInfo } = require('../models/companyInfoModel');

exports.getNavbarList = async (req, res) => {
    try {
        const storeId = req.session.storeId; // Get storeId from session
        console.log("StoreID: ", storeId);
        if (!storeId) {
            return res.status(400).send("Store ID is missing. Please log in again.");
        }
        const store = await Store.findOne({ _id: storeId });
        const companyInfo = await CompanyInfo.findOne({ storeId }); // Fetch company info based on storeId

        if (!companyInfo) {
            return res.status(404).send("Company info not found for the given store.");
        }
        res.render('./partials/navbar', { companyInfo, store });
    } catch (error) {
        console.error("Error fetching navbar data:", error);
        res.status(500).send("An error occurred while fetching navbar data.");
    }
};
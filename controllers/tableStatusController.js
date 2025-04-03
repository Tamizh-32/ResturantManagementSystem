const {Tablestatus,activeEnum} = require('../models/tableStatusModel');
const {Store} = require('../models/storeModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object

// List Table Status
exports.listTableStatus = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const storeId = req.storeId;
        const tableStatus = await Tablestatus.find({storeId}).populate('storeId');
        res.render('./components/tableStatus/tableStatusList', {
            title: 'TABLE STATUS LIST',
            tableStatus,companyInfo
        });
    } catch (error) {
        console.error("Error fetching table status: ", error);
        res.status(500).send("An error occurred while fetching table statuses.");
    }
};

// Render Add Table Status Page
exports.renderAddTableStatus = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const store = await Store.find({status:"active"});
        res.render('./components/tableStatus/addTableStatus', { store,activeEnum,companyInfo });
    } catch (error) {
        console.error("Error fetching stores: ", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
};

// Add Table Status
exports.addTableStatus = async (req, res) => {
    const { statusName,status } = req.body;
    const storeId = req.storeId;
    try {
        await Tablestatus.create({ statusName, storeId,status });
        req.flash('successMessage', 'Table Status Added Successfully!');
        res.redirect('/tablestatus');
    } catch (error) {
        console.error('Error Message:', error);
        req.flash('errorMessage', 'Failed to Add Table Status. Please Try Again!');
        res.redirect('/tablestatus');
    }
};

// Render Edit Table Status Page
exports.renderEditTableStatus = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const tablestatus = await Tablestatus.findById(req.params.id);
        const stores = await Store.find({status:"active"});
        res.render('./components/tableStatus/editTableStatus', { tablestatus, stores,activeEnum,companyInfo });
    } catch (error) {
        console.error('Error fetching table status:', error);
        res.status(500).send("An error occurred while fetching table status.");
    }
};

// Update Table Status
exports.updateTableStatus = async (req, res) => {
    const { statusName,status } = req.body;
    const storeId = req.storeId;
    try {
        await Tablestatus.findByIdAndUpdate(req.params.id, { statusName, storeId,status });
        req.flash('successMessage', 'Table Status Updated Successfully!');
        res.redirect('/tablestatus');
    } catch (error) {
        console.error('Error Message:', error);
        req.flash('errorMessage', 'Failed to Update Table Status. Please Try Again!');
        res.redirect(`/tablestatus/edit/${req.params.id}`);
    }
};

// Delete Table Status
exports.deleteTableStatus = async (req, res) => {
    try {
        await Tablestatus.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Table Status Deleted Successfully');
        res.redirect('/tablestatus');
    } catch (error) {
        console.error('Error Message:', error);
        req.flash('errorMessage', 'Failed to Delete Table Status. Please Try Again!');
        res.redirect('/tablestatus');
    }
};

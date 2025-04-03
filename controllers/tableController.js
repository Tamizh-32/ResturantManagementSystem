const {Table,activeEnum} = require('../models/tableModel');
const {Store} = require('../models/storeModel');
const {Tablestatus} = require('../models/tableStatusModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object

// List Tables
exports.getTables = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const storeId = req.storeId;
        const tables = await Table.find({storeId})
            .populate('storeId')
            .populate('tablestatusId');
        res.render('./components/tables/tableList', {
            title: 'TABLE LIST',
            tables,companyInfo
        });
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.status(500).send("An error occurred while fetching tables.");
    }
};

// Fetch Store ID from Store Collection & Render Add Table Page
exports.getAddTable = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const stores = await Store.find({status:"active"});
        const tablestatus = await Tablestatus.find({status:"active"});
        res.render('./components/tables/addTable', { stores, tablestatus,activeEnum,companyInfo });
    } catch (error) {
        console.error("Error fetching stores: ", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
};

// Add Table (POST request)
exports.postAddTable = async (req, res) => {
    const { tableName, capacity, tablestatusId,status } = req.body;
    const storeId = req.storeId;
    try {
        await Table.create({ tableName, capacity, tablestatusId, storeId,status });
        req.flash('successMessage', 'Table added successfully!');
        res.redirect('/tables');
    } catch (err) {
        console.error("Error adding table:", err);
        req.flash('errorMessage', 'Failed to add table. Please try again.');
        res.redirect('/tables/add');
    }
};

// Edit Table Page
exports.getEditTable = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const table = await Table.findById(req.params.id);
        const stores = await Store.find({status:"active"});
        const tablestatus = await Tablestatus.find({status:"active"});
        res.render('./components/tables/editTable', { table, stores, tablestatus,activeEnum,companyInfo });
    } catch (error) {
        console.error('Error fetching table or stores:', error);
        req.flash('errorMessage', 'Failed to load data for editing.');
        res.redirect('/tables');
    }
};

// Edit Table (PUT request)
exports.putEditTable = async (req, res) => {
    const { tableName, capacity, tablestatusId,status } = req.body;
    const storeId = req.storeId;
    try {
        await Table.findByIdAndUpdate(req.params.id, { tableName, capacity, tablestatusId, storeId,status });
        req.flash('successMessage', 'Table updated successfully!');
        res.redirect('/tables');
    } catch (err) {
        console.error("Error updating table:", err);
        req.flash('errorMessage', 'Failed to update table. Please try again.');
        res.redirect(`/tables/edit/${req.params.id}`);
    }
};

// Delete Table
exports.deleteTable = async (req, res) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Table deleted successfully!');
        res.redirect('/tables');
    } catch (err) {
        console.error("Error deleting table:", err);
        req.flash('errorMessage', 'Failed to delete table. Please try again.');
        res.redirect('/tables');
    }
};

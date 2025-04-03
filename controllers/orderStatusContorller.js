const {Orderstatus,activeEnum} = require('../models/orderStatusModel')

const {Store} = require('../models/storeModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object

// List Order Status
exports.getOrderStatusList = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const storeId = req.storeId;
        const orderStatus = await Orderstatus.find({storeId}).populate('storeId');
        res.render('./components/orderStatus/orderStatusList', {
            title: 'ORDER STATUS LIST',
            orderStatus,companyInfo
        });
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Render Add Order Status Page
exports.getAddOrderStatus = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const stores = await Store.find({status:"active"});
        console.log(stores);
        res.render('./components/orderStatus/addOrderStatus', { stores,activeEnum,companyInfo });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).send('An error occurred while fetching stores.');
    }
};

// Add Order Status (POST request)
exports.postAddOrderStatus = async (req, res) => {
    const { statusName,status } = req.body;
    const storeId = req.storeId;
    try {
        await Orderstatus.create({ statusName, storeId,status });
        req.flash('successMessage', 'Order Status added successfully!');
        res.redirect('/orderstatus');
    } catch (error) {
        console.error('Error adding order status:', error);
        req.flash('errorMessage', 'Failed to add order status. Please try again.');
        res.redirect('/orderstatus/add');
    }
};

// Render Edit Order Status Page
exports.getEditOrderStatus = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const orderstatus = await Orderstatus.findById(req.params.id);
        const stores = await Store.find({status:"active"});
        res.render('./components/orderStatus/editOrderStatus', {companyInfo, orderstatus, stores,activeEnum });
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Update Order Status (PUT request)
exports.putEditOrderStatus = async (req, res) => {
    const { statusName,status } = req.body;
    const storeId = req.storeId;
    try {
        await Orderstatus.findByIdAndUpdate(req.params.id, { statusName, storeId,status });
        req.flash('successMessage', 'Order Status updated successfully!');
        res.redirect('/orderstatus');
    } catch (error) {
        console.error('Error updating order status:', error);
        req.flash('errorMessage', 'Failed to update order status. Please try again.');
        res.redirect(`/orderstatus/edit/${req.params.id}`);
    }
};

// Delete Order Status
exports.deleteOrderStatus = async (req, res) => {
    try {
        await Orderstatus.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Order Status deleted successfully!');
        res.redirect('/orderstatus');
    } catch (error) {
        console.error('Error deleting order status:', error);
        req.flash('errorMessage', 'Failed to delete order status. Please try again.');
        res.redirect('/orderstatus');
    }
};

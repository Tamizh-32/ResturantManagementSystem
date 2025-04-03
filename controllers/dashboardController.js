const { Product } = require('../models/productModel');
const { Order } = require('../models/orderModel');
const { Usermodel } = require('../models/userModel');
const { Store } = require('../models/storeModel');
const { Table } = require('../models/tableModel');
const mongoose = require('mongoose');
const { SPECIAL_STORE_ID } = require('../config/specialStoreId'); // Import the constant

const isAdmin = (storeId) => storeId === '67ae2846f763c017682b2beb';

const getDashboardData = async (storeId) => {
    try {
        // Filter all queries by storeId
        const totalProducts = await Product.countDocuments({ storeId });
        const totalUsers = await Usermodel.countDocuments({ storeId });

        const totalStores = await Store.countDocuments({});
        const totalTables = await Table.countDocuments({ storeId });

        // Use actual ObjectId for filtering
        const availableTableId = new mongoose.Types.ObjectId("6797662d4b7ccf1c051c3378");
        const availableTables = await Table.countDocuments({ tablestatusId: availableTableId, storeId });

        const completedStatusId = new mongoose.Types.ObjectId("67e782655fd46017aa692167");
        const pendingStatusId = new mongoose.Types.ObjectId("67972f1ace73baa4bd5cd68c");

        const totalPaidOrders = await Order.countDocuments({ orderstatusId: completedStatusId, storeId });
        const pendingOrders = await Order.countDocuments({ orderstatusId: pendingStatusId, storeId });

        // Get today's orders for the specific store
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
        const todayOrders = await Order.countDocuments({
            createdDate: { $gte: startOfToday },
            storeId
        });

        return {
            totalProducts,
            totalPaidOrders,
            totalStores,
            totalUsers,
            totalTables,
            todayOrders,
            pendingOrders,
            availableTables,
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error; // Throw the error to be handled by the caller
    }
};

// Dashboard controller
exports.getDashboard = async (req, res) => {
    try {
        const storeId = req.storeId; // Get storeId from the request object
        const companyInfo = req.companyInfo; // Get companyInfo from the request object

        // Fetch dashboard data
        const dashboardData = await getDashboardData(storeId);

        // Render the dashboard view with companyInfo and dashboardData
        res.render('./components/dashboard/dashboard', {
            title: 'DASHBOARD',
            ...dashboardData, // Spread dashboard data into the view
            companyInfo, // Pass companyInfo to the view
            isAdmin: storeId === SPECIAL_STORE_ID // Add isAdmin flag
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send("An error occurred while fetching dashboard data.");
    }
};
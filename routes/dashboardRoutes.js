const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to the dashboard route
router.get('/dashboard', authController.protectData, fetchCompanyInfo, async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        // Check if the user just logged in
        const justLoggedIn = req.session.justLoggedIn || false;

        // Clear the session flag so the message doesn't show again
        req.session.justLoggedIn = false;

        // Call the getDashboard controller function
        await dashboardController.getDashboard(req, res);
    } catch (error) {
        console.error("Error loading dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
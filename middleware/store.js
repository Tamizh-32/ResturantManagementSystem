const {Store} = require('../models/storeModel');

module.exports = async (req, res, next) => {
  try {
    const store = await Store.find(); // Fetch store from DB
    res.locals.store = store || {}; // Make it available globally
  } catch (error) {
    console.error("Error fetching store :", error);
    res.locals.store = {}; // Set empty object if an error occurs
  }
  next();
};
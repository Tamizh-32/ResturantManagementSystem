const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  status: { type: String, required: true },
});


// Apply timestamps
applyTimestamps(categorySchema);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

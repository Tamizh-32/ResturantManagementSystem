const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  // status: { type: String, required: true },
     storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model
     status:{ type: String,
      enum: ["active", "inactive"]
  }
});


// Apply timestamps
applyTimestamps(categorySchema);

const Category = mongoose.model('Category', categorySchema);
module.exports = {Category,
  activeEnum: categorySchema.path('status').enumValues, // Extract enum values for active
};

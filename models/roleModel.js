const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file


const roleSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  role: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  menuPermissions: [
    {
      menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menus',
        required: true
      },
      viewRoute: {
        type: String,
        default: null
      },
      addRoute: {
        type: String,
        default: null
      },
      editRoute: {
        type: String,
        default: null
      },
      deleteRoute: {
        type: String,
        default: null
      }
    }
  ],
  status:{ type: String,
    enum: ["active", "inactive"]
}
});

// Apply timestamps
applyTimestamps(roleSchema);

const Roles = mongoose.model('Roles', roleSchema);
module.exports = {Roles,
  activeEnum: roleSchema.path('status').enumValues, // Extract enum values for active
};
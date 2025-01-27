const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file

const tableSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  capacity: { type: Number, required: true },
  tablestatusId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tablestatus', required: true }, 
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model
});

// Apply timestamps
applyTimestamps(tableSchema);

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;

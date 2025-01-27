const mongoose = require('mongoose');
const applyTimestamps = require('../utils/timestamps'); // Import the utility file

const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  status: { type: String, required: true },
});


// Apply timestamps
applyTimestamps(storeSchema);

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;

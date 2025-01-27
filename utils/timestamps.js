// timestamps.js
function applyTimestamps(schema) {
    // Add fields to the schema
    schema.add({
      createdBy: { type: String, default: 'Tamizh' },
      createdDate: { type: Date, default: Date.now },
      updatedBy: { type: String, default: 'Tamizh' },
      updatedDate: { type: Date, default: Date.now },
    });
  
    // Middleware to update `updatedDate` and `updatedBy` before saving
    schema.pre('save', function (next) {
      this.updatedDate = new Date();
      next();
    });
  
    // Middleware to handle `findOneAndUpdate` and other update operations
    schema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
      const update = this.getUpdate();
      if (!update) return next();
      update.updatedDate = new Date();
      next();
    });
  }
  
  module.exports = applyTimestamps;
  
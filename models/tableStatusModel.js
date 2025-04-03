const mongoose = require('mongoose');
const applyTimestamps=require('../utils/timestamps');

const tableStatusSchema =  new mongoose.Schema({
    statusName:{type:String,required:true},
    storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
    status:{ type: String,
        enum: ["active", "inactive"]
    }
})

applyTimestamps(tableStatusSchema);

const Tablestatus =  mongoose.model('Tablestatus',tableStatusSchema);
module.exports={Tablestatus,
    activeEnum: tableStatusSchema.path('status').enumValues, // Extract enum values for active
};

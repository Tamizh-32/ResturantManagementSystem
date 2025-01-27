const mongoose = require('mongoose');
const applyTimestamps=require('../utils/timestamps');

const tableStatusSchema =  new mongoose.Schema({
    statusName:{type:String,required:true},
    storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},

})

applyTimestamps(tableStatusSchema);

const Tablestatus =  mongoose.model('Tablestatus',tableStatusSchema);
module.exports=Tablestatus;

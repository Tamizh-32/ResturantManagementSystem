const mongoose=require('mongoose');
const applyTimestamps=require('../utils/timestamps');

const productSchema=new mongoose.Schema({
    productName:{type:String,required:true},
    image:{type:String,required:true},
    price:{type:String,required:true},
    description:{type:String},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'Category', required:true},
    storeId: {type:mongoose.Schema.Types.ObjectId,ref:'Store', required: true }, // Reference to Store model
    status:{ type: String,
        enum: ["active", "inactive"]
    }
    
})

applyTimestamps(productSchema);
const Product=mongoose.model('Product',productSchema);
module.exports={Product,
    activeEnum: productSchema.path('status').enumValues, // Extract enum values for active
};

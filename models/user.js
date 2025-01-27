const mongoose=require('mongoose');
const applyTimestamps=require('../utils/timestamps');

const userSchema= new mongoose.Schema({
    group:{type:String,required:true},
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, 
    userName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    confirmPassword:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    phone:{type:String,required:true},
    gender:{type:String,required:true}
})

const User= mongoose.model('User',userSchema);
module.exports=User;
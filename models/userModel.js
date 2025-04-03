const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const usermodelSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Store', required: true 
}, 
    userName: {
        type: String,
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    image:{type:String},
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: 3,
        select: false // Prevent password from being returned in queries
    },
    firstName:{
        type:String,
        required:[true,"First Name is Required"]
    },
    lastName:{
        type:String,
        required:[true,"Last Name is Required"]
    },
    gender:{
        type:String,
        required:[true,"Gender is Required"]
    },
    phone:{
        type:String,
        required:[true,"Phone is Required"]
    },

    passwordChangedDate: Date,

    roleId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Roles' }, // Reference Role

    status:{ type: String,
        enum: ["active", "inactive"]
    }
});





// Pre-save hook to hash password
usermodelSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        // console.log("this.Password:",this.password);
        this.passwordChangedDate = Date.now(); // Update password change date
    }
    next();
});

// Remove password from JSON responses
usermodelSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

// Check if user changed password after JWT was issued
usermodelSchema.methods.verifyPassword = function (jwtTimestamp) {
    if (this.passwordChangedDate) {
        const passwordChangeTime = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
        return passwordChangeTime > jwtTimestamp;
    }
    return false;
}

const Usermodel = mongoose.model('Usermodel', usermodelSchema);
module.exports = {Usermodel,
    activeEnum: usermodelSchema.path('status').enumValues, // Extract enum values for active
};

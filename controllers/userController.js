const {Usermodel,activeEnum} = require('../models/userModel');

const {Store} = require('../models/storeModel');
const {Roles}= require('../models/roleModel'); // Destructure Roles from the exported object
const { SPECIAL_STORE_ID } = require('../config/specialStoreId'); // Import the constant
// Get Users
exports.getUsers = async (req, res) => {
    try {
        if(req.storeId==SPECIAL_STORE_ID){
            const companyInfo = req.companyInfo;
            const user = await Usermodel.find({}).populate('storeId').populate('roleId');
            console.log("User:", user);
            res.render('./components/users/userList', { title: 'USER LIST', user,companyInfo });
        }else{
            const companyInfo = req.companyInfo;
        const storeId = req.storeId;
        const user = await Usermodel.find({storeId}).populate('storeId').populate('roleId');
        console.log("User:", user);
        res.render('./components/users/userList', { title: 'USER LIST', user,companyInfo });
        }
    } catch (error) {
        console.error("Error fetching Users:", error);
        res.status(500).send("An error occurred while fetching Users.");
    }
};

// Render Add User Page
exports.getAddStore = async (req, res) => {
    try {
        if(req.storeId==SPECIAL_STORE_ID){
            const companyInfo = req.companyInfo;
            const stores = await Store.find({status:"active"});
            console.log("Stores:",stores);
            const roles = await Roles.find({status:"active"}); // Now Roles.find() will work
            console.log("Roles:", roles);
            res.render('./components/users/addUser', { stores, roles,   activeEnum, companyInfo// Pass the enum values for active
             });
        }else{
            const companyInfo = req.companyInfo;
            const storeId = req.storeId; // Get storeId from the request object
            console.log("StoreId:",storeId);
            const stores = await Store.find({_id:storeId});
            console.log("Stores:",stores);
            const roles = await Roles.find({storeId}); // Now Roles.find() will work
            console.log("Roles:", roles);
            res.render('./components/users/addUser', { stores, roles,activeEnum,companyInfo});
        }
    } catch (error) {
        console.error("Error fetching stores: ", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
};

// Sign Up (Create User)
exports.signUp = async (req, res, next) => {
    try {
        if(req.storeId==SPECIAL_STORE_ID){
            const { storeId, userName, email, password, confirm_password, roleId, firstName, lastName, gender, phone,status } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null;
            // Check if email already exists
            const existingUser = await Usermodel.findOne({ email });
            if (existingUser) {
                return res.render('./components/users/addUser', {
                    errorEmail: "Email is already taken",
                    formData: req.body // Retain form data
                });
            }
    
            // Validate password confirmation
            if (!password || !confirm_password || password !== confirm_password) {
                return res.render('./components/users/addUser', {
                    errorConfirmPassword: "Passwords do not match",
                    formData: req.body // Retain form data
                });
            }
    
            // Create a new user
            const newUser = await Usermodel.create({ 
                storeId, 
                userName, 
                email, 
                image, 
                password, 
                roleId, 
                firstName, 
                lastName, 
                gender, 
                phone,
                status
            });
    
            req.flash('successMessage', 'User Created successfully!');
            res.redirect('/users');
      
        }else{
            const { userName, email, password, confirm_password, roleId, firstName, lastName, gender, phone,status } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null;
            const storeId=req.storeId;
            // Check if email already exists
            const existingUser = await Usermodel.findOne({ email });
            if (existingUser) {
                return res.render('./components/users/addUser', {
                    errorEmail: "Email is already taken",
                    formData: req.body // Retain form data
                });
            }
    
            // Validate password confirmation
            if (!password || !confirm_password || password !== confirm_password) {
                return res.render('./components/users/addUser', {
                    errorConfirmPassword: "Passwords do not match",
                    formData: req.body // Retain form data
                });
            }
    
            // Create a new user
            const newUser = await Usermodel.create({ 
                storeId, 
                userName, 
                email, 
                image, 
                password, 
                roleId, 
                firstName, 
                lastName, 
                gender, 
                phone,
                status
            });
    
            req.flash('successMessage', 'User Created successfully!');
            res.redirect('/users');

        }
    }catch (error) {
        console.error("Error in creating new user:", error); // Log the error for debugging
        req.flash('errorMessage', 'Failed to Create a User, Try Again!');
        res.render('./components/users/addUser', {
            errorMessage: "Error in creating new user: " + error.message,
            formData: req.body
        });
    }
       
};
// Render Edit User Page
exports.getEditUser = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const user = await Usermodel.findById(req.params.id);
        const stores = await Store.find({status:"active"});
        const roles = await Roles.find({status:"active"});
        res.render('./components/users/editUser', { user, stores, roles,activeEnum,companyInfo });
    } catch (error) {
        console.error('Error fetching User or stores:', error);
        req.flash('errorMessage', 'Failed to load data for editing.');
        res.redirect('/users');
    }
};

// Edit User
exports.editSignUp = async (req, res) => {
    try {
        const { id } = req.params;
        const { storeId, userName, email, firstName, lastName, gender, phone, roleId, password, confirm_password,status } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage;
        console.log("Request Body:", req.body);

        const user = await Usermodel.findById(id);
        console.log("User:", user);

        if (!user) {
            req.flash("errorMessage", "User not found");
            return res.redirect("/users");
        }

        // Check if the email is being changed and if the new email already exists
        if (email !== user.email) {
            const existingUser = await Usermodel.findOne({ email });
            if (existingUser) {
                const stores = await Store.find({});
                return res.render('./components/users/editUser', {
                    errorEmail: "Email is already taken",
                    user: { ...req.body, _id: id }, // Pass the updated form data
                    stores // Pass stores for the dropdown
                });
            }
        }

        // Update fields
        user.storeId = storeId;
        user.userName = userName;
        user.email = email;
        user.image = image;
        user.firstName = firstName;
        user.lastName = lastName;
        user.gender = gender;
        user.phone = phone;
        user.roleId = roleId;
        user.status=status;

        // Only update password if it's provided and matches the confirmation
        if (password && confirm_password && password === confirm_password) {
            user.password = password;
        } else if (password || confirm_password) {
            const stores = await Store.find({});
            return res.render('./components/users/editUser', {
                errorConfirmPassword: "Passwords do not match",
                user: { ...req.body, _id: id }, // Pass the updated form data
                stores // Pass stores for the dropdown
            });
        }

        await user.save();
        req.flash("successMessage", "User updated successfully");
        res.redirect("/users");
    } catch (error) {
        console.error("Error updating user:", error);
        req.flash("errorMessage", "Failed to update user. Please try again.");
        res.redirect("/users");
    }
};

// Delete User
exports.deleteUsers = async (req, res) => {
    try {
        await Usermodel.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'User deleted successfully!');
        res.redirect('/users');
    } catch (error) {
        console.error("Error deleting user:", error);
        req.flash('errorMessage', 'Failed to delete user. Please try again.');
        res.redirect('/users');
    }
};

exports.getProfile = async (req, res) => {
    try {
        const companyInfo = req.companyInfo;
        const user = await Usermodel.findById(req.user._id).populate('roleId');
        res.render('./components/profile/profile', { user,companyInfo });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send("Server Error");
    }
};


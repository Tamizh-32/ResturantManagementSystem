const express = require('express');
const User = require('../models/user');
const Store = require('../models/store');
const router = express.Router();
const path = require('path');
const flash = require('connect-flash');

// List Users Routing
router.get('/users', async (req, res) => {
    const users = await User.find({}).populate('storeId');
    res.render('./components/users/userList', { users ,
        title: 'USERS LIST',
        users: users       // Passing the users data to the view
    });
});

// Add User Routing
router.get('/users/add', async (req, res) => {
    try {
        const stores = await Store.find({});
        // console.log("Stores: ", stores);
        res.render('./components/users/addUser', { stores });
    } catch (error) {
        console.error("Error fetching stores: ", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
});


// Add User POST 
router.post('/users', async (req, res) => {
    const { group, storeId, userName, email, password, confirmPassword, firstName, lastName, phone, gender } = req.body;
 
    // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
      req.flash('errorMessage', 'Email is already taken!');
      return res.redirect('/users/add');
  }
    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
        req.flash('errorMessage', 'Password and Confirm Password do not match!');
        return res.redirect('/users/add');
    }
    try {
        // Create user if validation passes
        await User.create({ group, storeId, userName, email, password,confirmPassword, firstName, lastName, phone, gender });
        req.flash('successMessage', 'User Added Successfully!');
        res.redirect('/users');
    } catch (err) {
        console.error('ErrorMessage: ', err);
        req.flash('errorMessage', 'Failed to Add User. Please Try Again!');
        res.redirect('/users/add');
    }
});



// Edit User Routing
router.get('/users/edit/:id',async(req, res)=> {
    
    try {
        const user= await User.findById(req.params.id);
        const stores=await Store.find({});
        res.render('./components/users/editUser',{user,stores});
    } catch (error) {
        console.error('Error fetching user or stores:', error);
        req.flash('error', 'Failed to load data for editing.');
        res.redirect('/users');
    }
});

// Edit User PUT
router.put('/users/:id', async (req, res) => {
    const { group, storeId, userName, email, password, confirmPassword, firstName, lastName, phone, gender } = req.body;
    try {

         // Validate if the email is already taken
         const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
         if (existingUser) {
             req.flash('errorMessage', 'Email is already taken!');
             return res.redirect(`/users/edit/${req.params.id}`);
         }

        // Validate that password and confirmPassword match
        if (password !== confirmPassword) {
            req.flash('errorMessage', 'Password and Confirm Password do not match!');
            return res.redirect(`/users/edit/${req.params.id}`);
        }
        // Update user details
        const updatedData = { group, storeId, userName, email, firstName, lastName, phone, gender };
        // Only update password if it is provided
        if (password) {
            updatedData.password = password;
        }
        await User.findByIdAndUpdate(req.params.id, updatedData);
        req.flash('successMessage', 'User Updated Successfully!');
        res.redirect('/users');
    } catch (error) {
        console.error('ErrorMessage:', error);
        req.flash('errorMessage', 'Failed to Update User. Please Try Again!');
        res.redirect(`/users/edit/${req.params.id}`);
    }
});

// Delete User Delete Method

router.delete('/users/:id',async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        req.flash('successMessage','User Deleted Successfully!');
        res.redirect('/users');
    } catch (error) {
        console.error('ErrorMessage:',error);
        req.flash('errorMessage','Failed to  Delete User.Please Try Again!');
        res.redirect('/users');
    }

})


module.exports = router;

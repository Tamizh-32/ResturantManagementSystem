const express=require('express');
const router=express.Router();
const Store=require('../models/store');
const path=require('path');
const flash=require('connect-flash');



// List Stores
router.get('/stores',async (req, res) => {
    const stores = await Store.find({});  
    // console.log("Stores: ",stores);
   res.render('./components/stores/storeList', { stores,
    title: 'STORE LIST',
    stores: stores       // Passing the stores data to the view
    });
})


// Add store routing
router.get('/stores/add',(req, res) => {
    res.render('./components/stores/addStore');
 })


// Add Store (POST request)
router.post('/stores', async (req, res) => {
  const { storeName, status } = req.body;  // Capture form data
  try {
      await Store.create({ storeName, status });  // Save store data to MongoDB
      req.flash('successMessage', 'Store added successfully!');
      res.redirect('/stores');  // Redirect to the list of stores
  } catch (err) {
      console.error("Error adding store:", err);
      req.flash('errorMessage', 'Failed to add store. Please try again.');
      res.redirect('/stores/add');  // Redirect back to the form if there's an error
  }
});


 // Edit store
router.get('/stores/edit/:id',async(req, res) => {
  const store = await Store.findById(req.params.id);
    res.render('./components/stores/editStore',{store});
 })

 // Edit Store (Put request)

 router.put('/stores/:id', async (req, res) => {

  const { storeName, status } = req.body;
  try {
    await Store.findByIdAndUpdate(req.params.id, { storeName, status });
    req.flash('successMessage', 'Store updated successfully!');
    res.redirect('/stores');
  } catch (err) {
    console.error("Error updating store:", err);
    req.flash('errorMessage', 'Failed to update store. Please try again.');
    res.redirect(`/stores/edit/${req.params.id}`);
  }
});


 // Delete Store
 router.delete('/stores/:id', async (req, res) => {
  try {
      await Store.findByIdAndDelete(req.params.id);
      req.flash('successMessage', 'Store Deleted successfully!');
      res.redirect('/stores');
    } catch (err) {
      req.flash('errorMessage', 'Failed to Delete store. Please try again.');
      res.redirect('/stores');
    }
});


module.exports=router;

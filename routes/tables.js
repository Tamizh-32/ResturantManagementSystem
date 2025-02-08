const express=require('express');
const router=express.Router();
const Table=require('../models/tables');
const Store=require('../models/store');
const Tablestatus=require('../models/tableStatus');
const path=require('path');
const flash=require('connect-flash');


// List Tables
router.get('/tables',async (req, res) => {
   const tables = await Table.find({})
   .populate('storeId')
   .populate('tablestatusId');
  res.render('./components/tables/tableList', { tables,
    title: 'TABLE LIST',
    tables: tables       // Passing the tables data to the view
   });
})


// Fetch Sotre Id From the Store Collection
   // Add User Routing
router.get('/tables/add', async (req, res) => {
  try {
      const stores = await Store.find({});
      const tablestatus=await Tablestatus.find({});
      res.render('./components/tables/addTable', { stores,tablestatus });
  } catch (error) {
      console.error("Error fetching stores: ", error);
      res.status(500).send("An error occurred while fetching stores.");
  }
});


// Add Table (POST request)
router.post('/tables', async (req, res) => {
   const { tableName,capacity,tablestatusId,storeId } = req.body;  // Capture form data
   try {
       await Table.create({ tableName,capacity,tablestatusId,storeId });  // Save store data to MongoDB
       req.flash('successMessage', 'Table added successfully!');
       res.redirect('/tables');  // Redirect to the list of tables
   } catch (err) {
       console.error("Error adding table:", err);
       req.flash('errorMessage', 'Failed to add table. Please try again.');
       res.redirect('/tables/add');  // Redirect back to the form if there's an error
   }
 });
 

 
 // Edit Table
 router.get('/tables/edit/:id', async (req, res) => {
   try {
     const table = await Table.findById(req.params.id); // Fetch the table to be edited
     const stores = await Store.find({}); // Fetch all stores
     const tablestatus = await Tablestatus.find({});
     res.render('./components/tables/editTable', { table, stores,tablestatus }); // Pass the data to the template
   } catch (error) {
     console.error('Error fetching table or stores:', error);
     req.flash('error', 'Failed to load data for editing.');
     res.redirect('/tables');
   }
 });
 

  // Edit Tables (Put request)

  router.put('/tables/:id', async (req, res) => {
   console.log("Request Body: ", req.body);
   const { tableName,capacity,tablestatusId,storeId } = req.body;
   try {
     await Table.findByIdAndUpdate(req.params.id, { tableName,capacity, tablestatusId,storeId });
     req.flash('successMessage', 'Table updated successfully!');
     res.redirect('/tables');
   } catch (err) {
     console.error("Error updating table:", err);
     req.flash('errorMessage', 'Failed to update table. Please try again.');
     res.redirect(`/tables/edit/${req.params.id}`);
   }
 });

// Delete Table
router.delete('/tables/:id', async (req, res) => {
   try {
       await Table.findByIdAndDelete(req.params.id);
       req.flash('successMessage', 'Table Deleted successfully!');
       res.redirect('/tables');
     } catch (err) {
       req.flash('errorMessage', 'Failed to Delete table. Please try again.');
       res.redirect('/tables');
     }
 });


module.exports=router;

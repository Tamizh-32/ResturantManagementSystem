const { Menus, activeEnum, viewEnum,editEnum,addEnum,deleteEnum } = require('../models/menusModel'); // Import Menus, activ
const {Store}= require('../models/storeModel');
const { SPECIAL_STORE_ID } = require('../config/specialStoreId'); // Import the constant

exports.getMenuList = async(req,res)=>{
    try {
      const companyInfo = req.companyInfo;
      if(req.storeId==SPECIAL_STORE_ID){
        const menuToEdit = await Menus.find({}).populate('storeId');
        res.render('./components/menus/menusList',{
            title:'MENU LIST',
            menuToEdit,companyInfo
        });  
      }else{
        const companyInfo = req.companyInfo;
        const storeId = req.storeId; // Get storeId from the request object
        const menuToEdit = await Menus.find({storeId}).populate('storeId');
        res.render('./components/menus/menusList',{
            title:'MENU LIST',
            menuToEdit,companyInfo
        });  
      }
      
          
    } catch (error) {
        console.error('Error Fetching Menus:',error);
        res.status(500).send('Internal Server Error');
    }
}

exports.getAddMenu=async(req,res)=>{
    try {
      const companyInfo = req.companyInfo;
        const stores=await Store.find({status:"active"});
        console.log(stores);
        res.render('./components/menus/addMenus',{  stores,
            activeEnum, // Pass the enum values for active
            viewEnum,
            addEnum, // Pass the enum values for route 
            editEnum,
            deleteEnum,companyInfo
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).send('An error occurred while fetching stores.');
    }
}

exports.postAddMenu = async (req, res) => {
    const { name, viewRoute, addRoute, editRoute, deleteRoute, status } = req.body;
    const storeId = req.storeId; // Get storeId from the request object
    try {
      // Validate required fields
      if (!name || !storeId || !status) {
        req.flash('errorMessage', 'Name, Store, and Status status are required.');
        return res.redirect('/menus/add');
      }
  
      // Create the menu with the provided data
      await Menus.create({
        name,
        viewRoute: viewRoute || null, // Set to null if not provided
        addRoute: addRoute || null,   // Set to null if not provided
        editRoute: editRoute || null, // Set to null if not provided
        deleteRoute: deleteRoute || null, // Set to null if not provided
        storeId,
        status,
      });
  
      req.flash('successMessage', 'Menu Added Successfully!');
      res.redirect('/menus');
    } catch (error) {
      console.error('Error adding menu:', error);
      req.flash('errorMessage', 'Failed to add menu. Please try again.');
      res.redirect('/menus/add');
    }
  };



// Render Edit menu Page
exports.getEditMenu = async (req, res) => {
    try {
      const menuToEdit = await Menus.findById(req.params.id);
      const stores = await Store.find({status:"active"});
      const companyInfo = req.companyInfo;
      res.render('./components/menus/editMenus', {
        menuToEdit,
        stores,
        activeEnum, // Pass the enum values for active
        viewEnum,
        addEnum, // Pass the enum values for route 
        editEnum,
        deleteEnum,companyInfo
      });
    } catch (error) {
      console.error('Error fetching menu:', error);
      res.status(500).send('Internal Server Error');
    }
  };



  exports.putEditMenu = async (req, res) => {
    const { name, viewRoute, addRoute, editRoute, deleteRoute, status } = req.body;
    const storeId = req.storeId; // Get storeId from the request object
    try {
      // Validate required fields
      if (!name || !storeId || !status) {
        req.flash('errorMessage', 'Name, Store, and status status are required.');
        return res.redirect(`/menus/edit/${req.params.id}`);
      }
  
      // Update the menu with the provided data
      await Menus.findByIdAndUpdate(req.params.id, {
        name,
        viewRoute: viewRoute || null, // Set to null if not provided
        addRoute: addRoute || null,   // Set to null if not provided
        editRoute: editRoute || null, // Set to null if not provided
        deleteRoute: deleteRoute || null, // Set to null if not provided
        storeId,
        status,
      });
  
      req.flash('successMessage', 'Menu updated successfully!');
      res.redirect('/menus');
    } catch (error) {
      console.error('Error updating Menu:', error);
      req.flash('errorMessage', 'Failed to update menu. Please try again.');
      res.redirect(`/menus/edit/${req.params.id}`);
    }
  };

// Delete Order Status
exports.deleteMenu = async (req, res) => {
    try {
        await Menus.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Menu deleted successfully!');
        res.redirect('/menus');
    } catch (error) {
        console.error('Error deleting order status:', error);
        req.flash('errorMessage', 'Failed to delete menu. Please try again.');
        res.redirect('/menus');
    }
};




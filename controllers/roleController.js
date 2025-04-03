const {Roles,activeEnum} = require('../models/roleModel'); // Import the Roles model
const {Store} = require('../models/storeModel');
const { Menus } = require('../models/menusModel'); // Import Menus
const {SPECIAL_STORE_ID} = require('../config/specialStoreId');
// Get Role List
exports.getRoleList = async (req, res) => {
    try {
      const companyInfo = req.companyInfo;
      if(req.storeId==SPECIAL_STORE_ID){
  // Populate storeId and menuPermissions.menuId
  const roles = await Roles.find({})
  .populate('storeId')
  .populate('menuPermissions.menuId'); // Correct population path

console.log("Roles:", roles);

res.render('./components/roles/roleList', {
  title: 'ROLE LIST',
  roles,companyInfo
});
      }else{
        const companyInfo = req.companyInfo;
        const storeId = req.storeId;
          // Populate storeId and menuPermissions.menuId
      const roles = await Roles.find({storeId})
      .populate('storeId')
      .populate('menuPermissions.menuId'); // Correct population path

    console.log("Roles:", roles);

    res.render('./components/roles/roleList', {
      title: 'ROLE LIST',
      roles,companyInfo
    });
      }
    
    } catch (error) {
      console.error('Error Fetching Roles:', error);
      res.status(500).send('Internal Server Error');
    }
};

// Render Add Role Page
exports.getAddRole = async (req, res) => {
  try {
    const companyInfo = req.companyInfo;
      const storeId = req.storeId;
      // Populate storeId and menuPermissions.menuId
      const stores = await Store.find({storeId});
      const menus = await Menus.find({storeId}); // Fetch all menus
      console.log("Menus: ",menus);
      
      res.render('./components/roles/addRole', {
        stores,companyInfo,
        menus, // Pass menus to the template
        activeEnum // Pass the enum values for active
      });
    

  } catch (error) {
    console.error('Error fetching stores or menus:', error);
    res.status(500).send('An error occurred while fetching data.');
  }
};




exports.postAddRole = async (req, res) => {
  try {
    const { role, permissions, status } = req.body;
    const storeId = req.storeId;

    console.log("Received Data:", { role, permissions, status, storeId });

    const menuPermissions = permissions ? Object.keys(permissions).map(menuId => ({
      menuId,
      viewRoute: permissions[menuId].viewRoute || false,
      addRoute: permissions[menuId].addRoute || false,
      editRoute: permissions[menuId].editRoute || false,
      deleteRoute: permissions[menuId].deleteRoute || false
    })) : [];

    console.log("Menu Permissions:", menuPermissions);

    const newRole = new Roles({
      storeId,
      role,
      menuPermissions,
      status
    });

    await newRole.save();
    console.log("Role Saved Successfully:", newRole);
    res.redirect('/roles');
  } catch (err) {
    console.error('Error adding role:', err.stack); // Log the full error stack trace
    res.status(500).send('Error adding role');
  }
};

// Render Edit Role Page
exports.getEditRole = async (req, res) => {
    try {
      const companyInfo = req.companyInfo;
      const storeId = req.storeId;
      const role = await Roles.findById(req.params.id)
        .populate('storeId')
        .populate('menuPermissions.menuId'); // Populate menu permissions
  
      const stores = await Store.find({storeId});
      const menus = await Menus.find({storeId}); // Fetch all menus
  
      // Create a map for easier permission lookup
      const permissionMap = {};
      role.menuPermissions.forEach((perm) => {
        permissionMap[perm.menuId._id] = {
          viewRoute: perm.viewRoute,
          addRoute: perm.addRoute,
          editRoute: perm.editRoute,
          deleteRoute: perm.deleteRoute,
        };
      });
  
      res.render('./components/roles/editRole', {
        role,
        stores,
        menus,
        permissionMap,
        activeEnum,companyInfo
      });
    } catch (error) {
      console.error('Error fetching role or menus:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  

// Update Role
exports.putEditRole = async (req, res) => {
  const { role, status, permissions } = req.body;
  const storeId = req.storeId;

  try {
    // Extract menu permissions
    const menuPermissions = permissions ? Object.keys(permissions).map(menuId => ({
      menuId,
      viewRoute: permissions[menuId].viewRoute || null,
      addRoute: permissions[menuId].addRoute || null,
      editRoute: permissions[menuId].editRoute || null,
      deleteRoute: permissions[menuId].deleteRoute || null
    })) : [];

    // Update the role
    await Roles.findByIdAndUpdate(req.params.id, {
      role,
      storeId,
      status,
      menuPermissions
    });

    req.flash('successMessage', 'Role updated successfully!');
    res.redirect('/roles');
  } catch (error) {
    console.error('Error updating role:', error);
    req.flash('errorMessage', 'Failed to update role. Please try again.');
    res.redirect(`/roles/edit/${req.params.id}`);
  }
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    await Roles.findByIdAndDelete(req.params.id);
    req.flash('successMessage', 'Role deleted successfully!');
    res.redirect('/roles');
  } catch (error) {
    console.error('Error deleting role:', error);
    req.flash('errorMessage', 'Failed to delete role. Please try again.');
    res.redirect('/roles');
  }
};
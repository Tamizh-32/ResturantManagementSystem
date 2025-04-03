const mongoose = require('mongoose');
const applyTimestamps=require('../utils/timestamps');


const viewRoutes = [
    "/categories",
    "/companyinfo",
    "/dashboard",
    "/menus",
    "/orders",
    "/orderstatus",
    "/products",
    "/roles",
    "/stores",
    "/tables",
    "/tablestatus",
    "/profile",
    "/users",
    "/auth/logout",
    "/orders/view/:id",
    "/companyinfo/view/:id",
    "/navbar",
    "/notifications",

  ];
  const addRoutes=[
    "/categories/add",
    "/companyinfo/add",
    "/menus/add",
    "/orders/add",
    "/orderStatus/add",
    "/products/add",
    "/roles/add",
    "/stores/add",
    "/tables/add",
    "/tablestatus/add",
    "/user/add",
    "/notifications/:notificationId/read",
  ];
  const editRoutes=[
    "/categories/edit/:id",
    "/companyinfo/edit/:id",
    "/menus/edit/:id",
    "/orders/edit/:id",
    "/orderstatus/edit/:id",
    "/products/edit/:id",
    "/roles/edit/:id",
    "/stores/edit/:id",
    "/tables/edit/:id",
    "/tablestatus/edit/:id",
    "/users/edit/:id", 



  ];

  const deleteRoutes=[
    "/categories/:id",
    "/companyinfo/:id",
    "/menus/:id",
    "/orders/:id",
    "/orderstatus/:id",
    "/products/:id",
    "/roles/:id",
    "/stores/:id",
    "/tables/:id",
    "/tablestatus/:id",
    "/users/:id",
  ];

const menuSchema = new mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Reference to Store model
    name: { type: String, required: true }, // Menu name (e.g., "Dashboard", "Reports")
    viewRoute: { 
        type: String, 
       
        enum: viewRoutes // Restrict to valid routes only
      },
    addRoute: {
      type: String, 
  
      enum: addRoutes // Restrict to valid routes only
    },
    editRoute: {
      type: String, 
    
      enum: editRoutes // Restrict to valid routes only
    },
    deleteRoute: {
      type: String, 
    
      enum: deleteRoutes // Restrict to valid routes only
    },
    status:{ type: String,
        enum: ["active", "inactive"]
    }
});



applyTimestamps(menuSchema);
const Menus = mongoose.model('Menus', menuSchema);
module.exports = {
    Menus,
    activeEnum: menuSchema.path('status').enumValues, // Extract enum values for active
    viewEnum: menuSchema.path('viewRoute').enumValues, // Extract enum values for route
    addEnum: menuSchema.path('addRoute').enumValues, // Extract enum values for route
    editEnum: menuSchema.path('editRoute').enumValues, // Extract enum values for route
    deleteEnum: menuSchema.path('deleteRoute').enumValues // Extract enum values for route
};
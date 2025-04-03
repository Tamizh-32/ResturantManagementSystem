const {Usermodel} = require('../models/userModel');

module.exports = async (req, res, next) => {
  if (req.session.user) {
    try {
      const user = await Usermodel.findById(req.session.user._id)
        .populate({
          path: 'roleId',
          populate: { path: 'menuPermissions.menuId' } // Corrected population path
        });

      if (!user || !user.roleId) {
        console.error("User or roleId is null");
        res.locals.user = null;
        res.locals.menus = [];
        return next();
      }

      res.locals.user = user;
      res.locals.menus = user.roleId.menuPermissions.map(perm => perm.menuId) || [];
    } catch (error) {
      console.error("Error fetching user or menus:", error);
      res.locals.user = null;
      res.locals.menus = [];
    }
  } else {
    console.log("No user session found.");
    res.locals.user = null;
    res.locals.menus = [];
  }
  next();
};
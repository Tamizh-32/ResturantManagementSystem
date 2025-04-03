const {Usermodel} = require('../models/userModel');

module.exports = async (req, res, next) => {
  try {
    const user = await Usermodel.findById(req.user._id); // Fetch the logged-in user
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const storeId = user.storeId; // Get the storeId from the user

    // Attach the storeId to the request object
    req.storeId = storeId;

    // Check if the requested resource belongs to the user's store
    if (req.params.storeId && req.params.storeId !== storeId.toString()) {
      return res.status(403).json({ message: "Access denied. You do not have permission to access this store." });
    }

    next();
  } catch (error) {
    console.error("Store validation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
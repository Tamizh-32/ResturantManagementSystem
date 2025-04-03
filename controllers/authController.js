const {Usermodel,activeEnum} = require('../models/userModel');
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const {Store} = require('../models/storeModel');
const {Roles}= require('../models/roleModel'); // Destructure Roles from the exported object
const { isRouteAllowed } = require('../utils/routeMatcher'); // Import the utility

// Render Login Page
exports.getLogin = async (req, res) => {
    try {
        const stores = await Store.find();
        console.log("Login Stores: ",stores);
        res.render('login',stores);
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).send("An error occurred while fetching stores."); 
    }
 
};

exports.login = async (req, res) => {
    try {
        const { email, password, storeId } = req.body;

        if (!email || !password || !storeId) {
            return res.status(400).json({ message: "Email, password, and storeId are required" });
        }

        const user = await Usermodel.findOne({ email, storeId })
            .select("+password")
            .populate({
                path: 'roleId',
                populate: { path: 'menuPermissions.menuId' }
            });

        if (!user) {
            return res.status(400).json({ message: "Invalid email, password, or store" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email, password, or store" });
        }

        // Include storeId in the JWT token
        const token = jsonwebtoken.sign({ id: user._id, storeId: user.storeId }, process.env.JWT_SECRET, { expiresIn: "2d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        req.session.user = user;
        req.session.storeId = user.storeId; // Add storeId to session

        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to save session" });
            }
            res.locals.user = user;
            res.locals.menus = user.roleId.menuPermissions.map(perm => perm.menuId) || [];
            res.status(200).json({ message: 'Logged in successfully', redirect: '/dashboard' });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.attachStoreId = (req, res, next) => {
    if (req.session.storeId) {
        req.storeId = req.session.storeId;
    } else if (req.cookies.token) {
        const decodedToken = jsonwebtoken.verify(req.cookies.token, process.env.JWT_SECRET);
        req.storeId = decodedToken.storeId;
    } else {
        return res.status(401).redirect("/login");
    }
    next();
};



exports.protectData = async (req, res, next) => {
    let token;

    // Check for token in Authorization header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).redirect("/login");
    }

    try {
        // Verify the token
        const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        // Fetch the user with role and menu permissions
        const user = await Usermodel.findById(decodedToken.id).populate({
            path: 'roleId',
            populate: { 
                path: 'menuPermissions.menuId',
                select: 'viewRoute addRoute editRoute deleteRoute' // Ensure these fields are selected
            }
        });

        if (!user) {
            return res.status(401).redirect("/login");
        }

        // Attach the user and storeId to the request object
        req.user = user;
        req.storeId = decodedToken.storeId; // Add storeId to the request object

        // Extract all allowed routes (view, add, edit, delete)
        const allowedRoutes = user.roleId.menuPermissions.flatMap(perm => {
            const routes = [];
            if (perm.viewRoute) routes.push(perm.viewRoute);
            if (perm.addRoute) routes.push(perm.addRoute);
            if (perm.editRoute) routes.push(perm.editRoute);
            if (perm.deleteRoute) routes.push(perm.deleteRoute);
            return routes;
        }).filter(route => route); // Ensure routes are strings and not undefined

        // Check if the user has access to the requested route
        const requestedRoute = req.path;
        const isAllowed = isRouteAllowed(requestedRoute, allowedRoutes);
        if (!isAllowed) {
            req.flash('errorMessage', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        // If the route is allowed, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in protectData middleware:", error);
        return res.status(401).redirect("/login");
    }
};

// Logout
exports.logout = async (req, res) => {
    // Clear the token cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    req.flash('successMessage', 'You have logged out successfully');
    res.status(200).redirect("/login");
};
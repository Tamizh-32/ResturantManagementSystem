const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import Configurations
const sessionConfig = require('./config/sessionConfig');
const hbs = require('./config/handlebarsConfig');

// Import Middleware
const flashMessages = require('./middleware/flashMessages');
const companyInfo = require('./middleware/companyInfo');
const store=require('./middleware/store');
const userAndMenus = require('./middleware/userAndMenus');

// Import Routes
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableStatusRouter = require('./routes/tableStatusRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tableRoutes = require('./routes/tableRoutes');
const companyInfoRoutes = require('./routes/companyInfoRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const orderStatusRoutes = require('./routes/orderStatusRoutes');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menusRoute');
const roleRoutes = require('./routes/roleRoutes');
const navRoutes=require('./routes/navbarRoutes');
const notification=require('./routes/notificationsRoutes');

const userRoutes = require('./routes/userRoutes');
const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/RMSDB';
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(sessionConfig);
app.use(flash());
app.use(flashMessages);
app.use(companyInfo);
app.use(store);
app.use(userAndMenus);

// Handlebars Configuration
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Mount Routes
app.use("/",authRoutes);

app.use(storeRoutes);
app.use(categoryRoutes);
app.use(companyInfoRoutes);
app.use(orderRoutes);
app.use(orderStatusRoutes);
app.use(tableStatusRouter);
app.use(dashboardRoutes);
app.use(productRoutes);
app.use(tableRoutes);
app.use(menuRoutes);
app.use(roleRoutes);
app.use(navRoutes);
app.use(notification);
app.use(userRoutes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('partials/404', {
    title: 'Page Not Found',
    errorMessage: 'The page you are looking for does not exist.',
  });
});

// CORS Configuration
app.use(cors({ origin: 'http://localhost:4000', credentials: true }));

// Start the Server
const port = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
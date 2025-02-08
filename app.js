
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

// Import Routers
const tableRouter = require('./routes/tables');
const storeRouter = require('./routes/stores');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/products');
const companyInfoRouter = require('./routes/companyInfos');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/orders');
const orderStatusRouter = require('./routes/orderStatus');
const tableStatusRouter = require('./routes/tableStatus');
const sidebarRouter = require('./routes/sidebar');
const dashboardRouter = require('./routes/dashboard');

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/RMSDB';
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session & Flash Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Set Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  next();
});

// Handlebars Setup

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials', // This should point correctly to your partials
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});


// Register Helpers
hbs.handlebars.registerHelper('inc', (value) => parseInt(value) + 1);
hbs.handlebars.registerHelper('eq', (a, b) => (a && b ? a.toString() === b.toString() : false));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use(storeRouter);
app.use(tableRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(companyInfoRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(orderStatusRouter);
app.use(tableStatusRouter);
app.use(sidebarRouter);
app.use(dashboardRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('partials/404', { // Updated path for 404
    title: 'Page Not Found',
    errorMessage: 'The page you are looking for does not exist.',
  });
});

// Start the Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

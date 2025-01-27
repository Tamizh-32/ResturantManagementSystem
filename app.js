const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
require('dotenv').config();
const hbs=require('hbs');
const bodyParser = require('body-parser'); 
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');


const tableRouter=require('./routes/tables');
const storeRouter=require('./routes/stores');
const categoryRouter=require('./routes/category');
const productRouter=require('./routes/products');
const companyInfoRouter=require('./routes/companyInfos');
const userRouter=require('./routes/users');
const orderRouter=require('./routes/orders');
const orderStatus=require('./routes/orderStatus');
const tableStatus=require('./routes/tableStatus');
// const exphbs = require('express-handlebars');

// express initialize
const app=express();

// mongo db connection
mongoose.connect('mongodb://localhost:27017/RMSDB')
.then(()=>console.log('MongoDB Connected'))
.catch((err)=>console.log('Connection Error',err))






// Middleware  Static file 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// Serial number start from 1
hbs.registerHelper('inc', function (value) {
    return parseInt(value) + 1;
  });


  // Register the 'eq' helper for Handlebars
  // hbs.registerHelper('eq', function (a, b) {
  //   return a.toString() === b.toString();
  // });
  

  hbs.registerHelper('eq', function (a, b) {
    if (a && b) {
      return a.toString() === b.toString();
    }
    return false;
  });

  
// toster message
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  }));
  
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    next();
  });
  


// Routing
app.use( storeRouter);
app.use( tableRouter);
app.use( categoryRouter);
app.use(productRouter);
app.use(companyInfoRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(orderStatus);
app.use(tableStatus);

const port=process.env.PORT|| 4000;
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
    
});
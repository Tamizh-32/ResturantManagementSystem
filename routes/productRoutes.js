const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const { protectData } = require('../controllers/authController');
const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Product Routes
router.get('/products',protectData,  productController.getProductList);

router.get('/products/add',protectData,  productController.getAddProduct);

router.post('/products', upload.single('image'),protectData,  productController.postAddProduct);

router.get('/products/edit/:id',protectData,  productController.getEditProduct);

router.put('/products/:id', upload.single('image'),protectData,  productController.putEditProduct);

router.delete('/products/:id',protectData,  productController.deleteProduct);

module.exports = router;

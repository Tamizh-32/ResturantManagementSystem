const express = require('express');
const router = express.Router();
const multer = require('multer');
const companyInfoController = require('../controllers/companyInfoController');
const { protectData } = require('../controllers/authController');
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const upload = multer({ storage });


const { fetchCompanyInfo } = require('../middleware/fetchCompanyInfo'); // Import the middleware

// Apply protectData and fetchCompanyInfo middleware to all routes
router.use(protectData);
router.use(fetchCompanyInfo);

// List Company
router.get('/companyinfo', protectData, companyInfoController.getCompanyInfoList);

// Add Company - GET
router.get('/companyinfo/add',protectData,  companyInfoController.getAddCompanyInfo);

// Add Company - POST
router.post('/companyinfo', upload.single('logo'),protectData,  companyInfoController.postAddCompanyInfo);

// Edit Company - GET
router.get('/companyinfo/edit/:id',protectData,  companyInfoController.getEditCompanyInfo);

// Edit Company - PUT
router.put('/companyinfo/:id', upload.single('logo'),protectData,  companyInfoController.putEditCompanyInfo);

// Delete Company
router.delete('/companyinfo/:id', protectData, companyInfoController.deleteCompanyInfo);

// View Company Info 
router.get('/companyinfo/view/:id',protectData, companyInfoController.viewCompanyInfo);



module.exports = router;

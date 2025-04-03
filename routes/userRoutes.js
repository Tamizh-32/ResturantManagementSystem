const express = require('express');
const { protectData } = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();
const multer = require('multer');

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


router.get('/users',protectData, userController.getUsers);

router.get('/user/add',protectData, userController.getAddStore);

router.post('/users',upload.single('image'),protectData,  userController.signUp);
// Edit Table Page
router.get('/users/edit/:id',protectData,  userController.getEditUser);

router.put('/users/:id',upload.single('image'),protectData, userController.editSignUp);

// Delete Category
router.delete('/users/:id',protectData,  userController.deleteUsers);

router.get('/profile',protectData , userController.getProfile);


module.exports=router;

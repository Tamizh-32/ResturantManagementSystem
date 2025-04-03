const express = require('express');
const { protectData } = require('../controllers/authController');
const authController = require('../controllers/authController');
const router = express.Router();


router.get(['/','/login'], authController.getLogin);

router.post('/auth/login', authController.login);

router.get('/auth/logout',protectData ,authController.logout);


module.exports = router;

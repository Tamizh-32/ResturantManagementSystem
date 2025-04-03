const { CompanyInfo, activeEnum } = require('../models/companyInfoModel');
const { Menus } = require('../models/menusModel');
const { Store } = require('../models/storeModel');
const { SPECIAL_STORE_ID } = require('../config/specialStoreId'); // Import the constant

// Helper function to check if the user is an admin
const isAdmin = (storeId) => storeId === '67ae2846f763c017682b2beb';

// List Company Info
exports.getCompanyInfoList = async (req, res) => {
    try {
        const companyInfo = req.companyInfo; 
        const { storeId } = req;
        let companyinfo;
        if(req.storeId==SPECIAL_STORE_ID){
            companyinfo = await CompanyInfo.find({}).populate('storeId');
        }
        if (isAdmin(storeId)) {
            companyinfo = await CompanyInfo.find({}).populate('storeId');
        } else {
            companyinfo = await CompanyInfo.find({ storeId }).populate('storeId');
        }
        if (isAdmin(storeId)) {
        res.render('./components/companyInfo/companyInfoList', {
            companyinfo,
            title: 'COMPANY INFO LIST',
            companyInfo
        })
    }else{
        res.render('./components/companyInfo/companyInfoView', {
            companyinfo,
            title: 'COMPANY INFO VIEW',
            companyInfo
        })
    }
    } catch (err) {
        console.error('Error fetching company info:', err);
        res.status(500).send('Error fetching company info.');
    }
};

// Add Company Info - GET
exports.getAddCompanyInfo = async (req, res) => {
    try {
        const companyInfo = req.companyInfo; 
        const stores = await Store.find({ status: 'active' });
        res.render('./components/companyInfo/addCompanyInfo', { stores, activeEnum,companyInfo });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).send('An error occurred while fetching stores.');
    }
};

// Add Company Info - POST
exports.postAddCompanyInfo = async (req, res) => {
    const { companyName, companyCode, chargeAmount, gstno, vatCharge, description, email, contact, street, city, state, zip, status, storeId } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await CompanyInfo.create({
            companyName,
            companyCode,
            chargeAmount,
            gstno,
            vatCharge,
            description,
            email,
            contact,
            street,
            city,
            state,
            zip,
            status,
            storeId,
            logo,
        });

        req.flash('successMessage', 'Company Info Added Successfully!');
        res.redirect('/companyinfo');
    } catch (err) {
        console.error('Error adding company info:', err);
        req.flash('errorMessage', 'Failed to Add Company Info. Please Try Again!');
        res.redirect('/companyinfo/add');
    }
};

// Edit Company Info - GET
exports.getEditCompanyInfo = async (req, res) => {
    try {
        const companyInfo = req.companyInfo; 
        const { storeId } = req;
        const stores = isAdmin(storeId) ? await Store.find({}) : await Store.find({ _id: storeId });
        const menus = isAdmin(storeId) ? await Menus.find({}) : await Menus.find({ storeId });
        const companyinfo = await CompanyInfo.findById(req.params.id);

        res.render('./components/companyInfo/editCompanyInfo', {
            companyinfo,
            menus,
            activeEnum,
            stores,
            companyInfo
        });
    } catch (err) {
        console.error('Error fetching company info for edit:', err);
        req.flash('errorMessage', 'Failed to fetch company info for editing.');
        res.redirect('/companyinfo');
    }
};

// View Company Info
exports.viewCompanyInfo = async (req, res) => {
    try {
        const { storeId } = req;
        let companyinfo;
        const companyInfo = req.companyInfo;
        if (isAdmin(storeId)) {
     
            const companyId = req.params.id;
            companyinfo = await CompanyInfo.findById(companyId).populate('storeId');
            companyinfo = [companyinfo]; // Wrap in array for consistency
        } else {
 
            companyinfo = await CompanyInfo.find({ storeId }).populate('storeId');
        }

        res.render('./components/companyInfo/companyInfoView', {
            companyinfo,
            companyInfo,
            title: 'COMPANY INFO DETAILS',
        });
    } catch (err) {
        console.error('Error fetching company info:', err);
        res.status(500).send('Error fetching company info.');
    }
};

// Edit Company Info - PUT
exports.putEditCompanyInfo = async (req, res) => {
    const { companyName, companyCode, chargeAmount, vatCharge, gstno, description, email, contact, street, city, state, zip, status } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : req.body.existingLogo;
    const { storeId } = req;

    try {
        await CompanyInfo.findByIdAndUpdate(req.params.id, {
            companyName,
            companyCode,
            chargeAmount,
            vatCharge,
            gstno,
            description,
            email,
            contact,
            street,
            city,
            state,
            zip,
            status,
            storeId,
            logo,
        });

        req.flash('successMessage', 'Company Info Updated Successfully!');
        res.redirect('/companyinfo');
    } catch (err) {
        console.error('Error updating company info:', err);
        req.flash('errorMessage', 'Failed to Update Company Info. Please Try Again!');
        res.redirect(`/companyinfo/edit/${req.params.id}`);
    }
};

// Delete Company Info
exports.deleteCompanyInfo = async (req, res) => {
    try {
        await CompanyInfo.findByIdAndDelete(req.params.id);
        req.flash('successMessage', 'Company Info Deleted Successfully!');
        res.redirect('/companyinfo');
    } catch (err) {
        console.error('Error deleting company info:', err);
        req.flash('errorMessage', 'Failed to Delete Company Info. Please Try Again!');
        res.redirect('/companyinfo');
    }
};
const express=require('express');
const CompanyInfo=require('../models/companyInfo')
const router=express.Router();



// List Company 
router.get('/companyinfo',async(req,res)=>{
    const companyinfo = await CompanyInfo.find({});
    res.render('./companyInfo/companyInfoList',{companyinfo});
});


// Add Company Routing
router.get('/companyinfo/add',(req,res)=>{
    res.render('./companyInfo/addCompanyInfo');
});

// Add Company POST

router.post('/companyinfo',async(req,res)=>{
    const {companyName,companyCode,chargeAmount,vatCharge,description,email,contact,address,status}=req.body;
   try {
    await CompanyInfo.create({companyName,companyCode,chargeAmount,vatCharge,description,email,contact,address,status});
    req.flash('successMessage','CompanyInfo Added Successfully!');
    res.redirect('/companyinfo');
   } catch (err) {
    console.error('Error Message: ',err);
    req.flash('errorMessage','Failed to Add Company Info. Please Try Again!');
    res.redirect('/companyinfo/add');
   }
});


// Edit Company Info Routing

router.get('/companyinfo/edit:id',async(req,res)=>{
    const companyinfo= await CompanyInfo.findById(req.params.id);
    console.log(companyinfo);
    res.render('./companyInfo/editCompanyInfo',{companyinfo});
})

// Edit Company Info PUT

router.put('/companyinfo/:id',async(req,res)=>{
    const {companyName,companyCode,chargeAmount,vatCharge,description,email,contact,address,status}=req.body;
    try {
        await CompanyInfo.findByIdAndUpdate(req.params.id,{companyName,companyCode,chargeAmount,vatCharge,description,email,contact,address,status});
        req.flash('successMessage','Company Info Updated Successfully!');
        res.redirect('/companyinfo');
    } catch (err) {
        console.error('Error Message:',err);
        req.flash('errorMessage','Failed to Update CompanyInfo, Please Try Again!')
        res.redirect('./companyInfo/editCompanyInfo');
    }
});

// Delete Company Info

router.delete('/companyinfo/:id',async(req,res)=>{
    try {
        await CompanyInfo.findByIdAndDelete(req.params.id);
        req.flash('successMessage','CompanyInfo Deleted Successfully!');
        res.redirect('/companyinfo');    
    } catch (err) {
        console.error('Error Message: ',err);
        req.flash('errorMessage','Failed to Delete Company Info. Please Try Again!');
        res.redirect('/companyinfo')
        
    }
   
})


module.exports=router;
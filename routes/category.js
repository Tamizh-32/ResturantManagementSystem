const express=require('express');
const router=express.Router();
const Category=require('../models/category');
const path=require('path');
const flash=require('connect-flash');


// List Category
router.get('/category',async (req, res)=>{

    const category = await Category.find({});  
    // console.log(category);
    res.render('./category/categoryList',{category});
});


// Add Category Route

router.get('/category/add',(req,res)=>{
    res.render('./category/addCategory');
})


// Add Category Post

router.post('/category',async(req,res)=>{
    const {categoryName,status}=req.body;
    try {
        await Category.create({categoryName,status});
        req.flash('successMessage', 'Category added Successfully!');
        res.redirect('/category');  // Redirect to the list of stores
    } catch (err) {
        console.error("Error adding category:", err);
        req.flash('errorMessage', 'Failed to add category. Please try again.');
        res.redirect('/category/add');  // Redirect back to the form if there's an error
    }

})



// Edit Category Route
router.get('/category/edit/:id',async(req,res)=>{
    const category = await Category.findById(req.params.id);
    res.render('./category/editCategory',{category});
})

// Edit Category PUT 

router.put('/category/:id', async(req,res)=>{
    const {categoryName,status}=req.body;
    try{
        await Category.findByIdAndUpdate(req.params.id,{categoryName,status});
        req.flash('successMessage','Category Updated Successfully!')
        res.redirect('/category');
    }catch(err){
        console.error("Error Updating Category:", err);
        req.flash('errorMessage','Failed to update Category. Please try again.');
        res.redirect(`/category/edit/${req.params.id}`);
    }
    
})

// Delete Category

router.delete('/category/:id',async(req,res)=>{
    try{
        await Category.findByIdAndDelete(req.params.id);
        req.flash('successMessage','Category Deleted Successfully!');
        res.redirect('/category');
    }
    catch(err){
        console.error("Error Deleting Category: ",err);
        req.flash('errorMessage', 'Failed to Delete Category. Please Try Again!')  
        res.redirect('/category')     
    }   
})




module.exports=router;



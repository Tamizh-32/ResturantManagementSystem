const express=require('express');
const router=express.Router();
const Orderstatus=require('../models/orderStatus');
const Store=require('../models/store');


// List OrderStatus
router.get('/orderstatus', async(req,res)=>{
        const orderStatus = await Orderstatus.find({}).populate('storeId')
        res.render('./components/orderStatus/orderStatusList',{orderStatus,
            title: 'ORDER STATUS LIST',
            orderStatus: orderStatus       // Passing the order data to the view
        });
})

// Add Order Status  Routing

router.get('/orderstatus/add',async(req,res)=>{
    try {
        const store = await Store.find({});
        res.render('./components/orderStatus/addOrderStatus',{store});  
    } catch (error) {
        console.error("Error fetching stores: ", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
})

// Add Order Status Post Method
router.post('/orderstatus', async(req,res)=>{
    const {statusName,storeId}=req.body;
    try {
        await Orderstatus.create({statusName,storeId});
        req.flash('successMesage','Order Status Added Successfully!');
        res.redirect('./orderStatus');
    } catch (error) {
        console.error('ErrorMessage:', error);
        req.flash('errorMessage', 'Failed to Add Order Status. Please Try Again!');
        res.redirect('./orderStatus');
    }
})

// Edit Order Status  Routing

router.get('/orderstatus/edit/:id',async(req,res)=>{
    const orderstatus = await Orderstatus.findById(req.params.id);
    const stores = await Store.find({}); // Fetch all stores
    res.render('./components/orderStatus/editOrderStatus',{orderstatus, stores});
});




// Update Order Status Put Method

router.put('/orderstatus/:id',async(req,res)=>{
    const {statusName,storeId}=req.body;
    try{
        await  Orderstatus.findByIdAndUpdate(req.params.id, {statusName,storeId});
        req.flash('successMessage','Order Status Updated Successfully!');
        res.redirect('/orderStatus');
    }catch(error){
        console.error('Error Message:',error);
        req.flash('errorMessage','Failed to Update Order Status. Please Try Again!');
        res.redirect(`/orderstatus/edit/${req.params.id}`);
    }
});

// Delete Order Status 

router.delete('/orderstatus/:id',async(req,res)=>{
    try {
        await Orderstatus.findByIdAndDelete(req.params.id);
        req.flash('successMessage','Order Status Deleted Successfully');
        res.redirect('/orderstatus');        
    } catch (error) {
        console.error('Error Message:',error);
        req.flash('errorMessage','Failed to Delete Order Status. Please Try Again!');
        res.redirect('/orderstatus');
    }
})




module.exports=router;

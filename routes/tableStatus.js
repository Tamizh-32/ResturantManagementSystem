const express=require('express');
const router=express.Router();
const Tablestatus=require('../models/tableStatus');
const Store=require('../models/store');


// List OrderStatus
router.get('/tablestatus', async(req,res)=>{
        const tableStatus = await Tablestatus.find({}).populate('storeId')
        res.render('./components/tableStatus/tableStatusList',{tableStatus,
            title: 'TABLE STATUS LIST',
            tableStatus: tableStatus       // Passing the tableStatus data to the view
        });
})

// Add Table Status  Routing

router.get('/tablestatus/add',async(req,res)=>{
    try {
        const store = await Store.find({});
        res.render('./components/tableStatus/addTableStatus',{store});  
    } catch (error) {
        console.error("Error fetching stores: ", error);
        res.status(500).send("An error occurred while fetching stores.");
    }
})

// Add Order Status Post Method
router.post('/tablestatus', async(req,res)=>{
    const {statusName,storeId}=req.body;
    try {
        await Tablestatus.create({statusName,storeId});
        req.flash('successMesage','Table Status Added Successfully!');
        res.redirect('./tableStatus');
    } catch (error) {
        console.error('ErrorMessage:', error);
        req.flash('errorMessage', 'Failed to Add Table Status. Please Try Again!');
        res.redirect('./tableStatus');
    }
})
  
// Edit Order Status  Routing

router.get('/tablestatus/edit/:id',async(req,res)=>{
    const tablestatus = await Tablestatus.findById(req.params.id);
    const stores = await Store.find({}); // Fetch all stores
    res.render('./components/tableStatus/editTableStatus',{tablestatus, stores});
});




// Update Table Status Put Method

router.put('/tablestatus/:id',async(req,res)=>{
    const {statusName,storeId}=req.body;
    try{
        await  Tablestatus.findByIdAndUpdate(req.params.id, {statusName,storeId});
        req.flash('successMessage','Table Status Updated Successfully!');
        res.redirect('/tableStatus');
    }catch(error){
        console.error('Error Message:',error);
        req.flash('errorMessage','Failed to Update Table Status. Please Try Again!');
        res.redirect(`/tablestatus/edit/${req.params.id}`);
    }
});

// Delete Order Status 

router.delete('/tablestatus/:id',async(req,res)=>{
    try {
        await Tablestatus.findByIdAndDelete(req.params.id);
        req.flash('successMessage','Table Status Deleted Successfully');
        res.redirect('/tablestatus');        
    } catch (error) {
        console.error('Error Message:',error);
        req.flash('errorMessage','Failed to Delete Table Status. Please Try Again!');
        res.redirect('/tablestatus');
    }
})




module.exports=router;

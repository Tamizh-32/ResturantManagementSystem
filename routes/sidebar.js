const express = require('express');
const router=express.Router();

router.get('/sidebar',(req,res)=>{
    res.render('./partials/sidebar');
})


module.exports=router;
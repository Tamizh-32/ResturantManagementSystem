
const express = require('express');
const router = express.Router();
const Order = require('../models/order');  // Assuming this is the correct path to your model
const Product = require('../models/product'); // Assuming you have a product model
const Table = require('../models/tables');
const Orderstatus= require('../models/orderStatus');
const Tablestatus=require('../models/tableStatus');
const Store=require('../models/store');



 // List Orders Routing
 router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('tableId', 'tableName') // populate table info
      .populate('orderstatusId','statusName')
      .populate('products.productId', 'productName');// populate productName inside products

      
    res.render('./components/orders/orderList', { orders, 
      title: 'ORDER LIST',  // Passing the title for the page
      orders: orders       // Passing the order data to the view
     });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
});



// Show form to add a new order
router.get('/orders/add', async (req, res) => {
  const availableTable = await Tablestatus.findOne({ statusName: 'Available' });
  if (!availableTable) {
    throw new Error('Available Table not found in the database');
  }
  const store = await Store.findOne({ storeName: 'Sunshine Cafe' });
  if (!store) {
    throw new Error(' Store not found in the database');
  }
  try {
    const tables = await Table.find({tablestatusId:availableTable._id,storeId:store._id});
    const products = await Product.find();
    res.render('components/orders/addOrder', { tables, products });
  } catch (err) {
    console.error('Error fetching tables/products:', err);
    res.status(500).send('Error fetching data for order creation');
  }
});



// Create Order POST method
router.post('/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      email,
      tableId,
      productId,
      qty,
      rate,
      amount,
      description,
      grossAmount,
      taxAmount,
      discount,
    } = req.body;

    // Fetch the "Pending" order status dynamically
    const pendingStatus = await Orderstatus.findOne({ statusName: 'Pending' });
    if (!pendingStatus) {
      throw new Error('Pending status not found in the database');
    }

    // Recalculate net amount
    const taxAmountValue = parseFloat(taxAmount) || 0;
    const discountValue = parseFloat(discount) || 0;
    const netAmount = parseFloat(grossAmount) +
      (parseFloat(grossAmount) * taxAmountValue / 100) -
      discountValue;

    // Create the new order
    const order = new Order({
      customerName,
      customerPhone,
      email,
      tableId,
      products: productId.map((id, index) => ({
        productId: id,
        qty: qty[index],
        rate: rate[index],
        amount: amount[index],
      })),
      description,
      grossAmount: parseFloat(grossAmount),
      taxAmount: taxAmountValue,
      discount: discountValue,
      netAmount,
      orderstatusId: pendingStatus._id, // Assign the "Pending" status ID dynamically
    });

    // Save the order to the database
    await order.save();

    // Update the table status to "Occupied" when the order is created
    const occupiedStatus = await Tablestatus.findOne({ statusName: 'Occupied' });
    if (!occupiedStatus) {
      throw new Error('Occupied status not found in the database');
    }
    await Table.findByIdAndUpdate(tableId, { tablestatusId: occupiedStatus._id });

    req.flash('successMessage', 'Order Created Successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('Error creating order:', error);
    req.flash('errorMessage', 'Failed to Create Order. Please Try Again!');
    res.redirect('/orders/add');
  }
});



// Edit Order Routing
router.get('/orders/edit/:id', async (req, res) => {

  const availableTable = await Tablestatus.findOne({ statusName: 'Available' });
  if (!availableTable) {
    throw new Error('Available Table not found in the database');
  }
  const store = await Store.findOne({ storeName: 'Sunshine Cafe' });
  if (!store) {
    throw new Error(' Store not found in the database');
  }
  try {
    const order = await Order.findById(req.params.id).populate('products.productId');
    const products = await Product.find({});
    const tables = await Table.find({
      $or: [
        { _id: order.tableId }, // Include the currently selected table
        { tablestatusId: availableTable._id, storeId: store._id } // Include available tables
      ]
    });
    // const tables = await Table.find({tablestatusId:availableTable._id,storeId:store._id});

    const orderstatus= await Orderstatus.find({});
    res.render('./components/orders/editOrder', { order, products,orderstatus,tables });
  } catch (err) {
    console.error(err);
    req.flash('errorMessage', 'Error loading the order details');
    res.redirect('/orders');
  }
});





// Update Order PUT method
router.put('/orders/:id', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      email,
      tableId,
      productId,
      qty,
      rate,
      amount,
      description,
      grossAmount,
      taxAmount,
      discount,
      orderstatusId,
    } = req.body;

    // Recalculate net amount
    const taxAmountValue = parseFloat(taxAmount) || 0;
    const discountValue = parseFloat(discount) || 0;
    const netAmountCalculated = parseFloat(grossAmount) +
      (parseFloat(grossAmount) * taxAmountValue / 100) -
      discountValue;

    // Map updated products
    const updatedProducts = productId.map((id, index) => ({
      productId: id,
      qty: qty[index],
      rate: rate[index],
      amount: amount[index],
    }));

    // Fetch the IDs for "Completed", "Canceled", and "Available" dynamically
    const completedStatus = await Orderstatus.findOne({ statusName: 'Completed' }); // Replace 'name' with your field
    const canceledStatus = await Orderstatus.findOne({ statusName: 'Canceled' });
    const availableStatus = await Tablestatus.findOne({ statusName: 'Available' });
    const occupiedStatus = await Tablestatus.findOne({ statusName: 'Occupied' });

    if (!completedStatus || !canceledStatus || !availableStatus || !occupiedStatus) {
      throw new Error('Required statuses not found in the database');
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerPhone,
        email,
        tableId,
        products: updatedProducts,
        description,
        grossAmount: parseFloat(grossAmount),
        taxAmount: taxAmountValue,
        discount: discountValue,
        netAmount: netAmountCalculated,
        orderstatusId,
      },
      { new: true }
    );

    // Check if the orderstatusId is "Completed" or "Canceled"
    if ([completedStatus._id.toString(), canceledStatus._id.toString()].includes(orderstatusId)) {
      // Update the table status to "Available"
      await Table.findByIdAndUpdate(tableId, { tablestatusId: availableStatus._id });
    } else {
      // Update the table status to "Occupied"
      await Table.findByIdAndUpdate(tableId, { tablestatusId: occupiedStatus._id });
    }

    req.flash('successMessage', 'Order Updated Successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('Error updating order:', error);
    req.flash('errorMessage', 'Failed to Update Order. Please Try Again!');
    res.redirect(`/orders/edit/${req.params.id}`);
  }
});






// Delete Order 

router.delete('/orders/:id',async(req,res)=>{
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.flash('successMessage','Order Deleted Successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('ErrorMessage:',error);
    req.flash('errorMessage',"Failed to Delete Order. Please Try Again!");
    res.redirect('/orders');
  }
});

module.exports = router;

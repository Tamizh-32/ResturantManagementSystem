const {Order} = require('../models/orderModel');
const {Product} = require('../models/productModel');
const {Table} = require('../models/tableModel');
const {Orderstatus} = require('../models/orderStatusModel');
const {Tablestatus} = require('../models/tableStatusModel');
const {Store} = require('../models/storeModel');
const {CompanyInfo} = require('../models/companyInfoModel');
const { Menus } = require('../models/menusModel'); // Destructure Menus from the exported object
const  Notification = require('../models/notificationModel');




exports.listOrders = async (req, res) => {
  try {
    const companyInfo = req.companyInfo;
    const storeId = req.storeId; 
    const orders = await Order.find({storeId})
      .sort({ createdDate: -1 })
      .populate('storeId')
      .populate('tableId', 'tableName')
      .populate('orderstatusId', 'statusName')
      .populate('products.productId', 'productName');

    res.render('./components/orders/orderList', { orders, title: 'ORDER LIST',companyInfo });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
};

exports.showAddOrderForm = async (req, res) => {
  try {
    const companyInfo = req.companyInfo;
    const storeId=req.storeId;
    const availableTable = await Tablestatus.findOne({ statusName: 'Available' });
    if (!availableTable) throw new Error('Available Table not found');
    const tables = await Table.find({ tablestatusId: availableTable._id,storeId});
    const products = await Product.find({status:"active",storeId});
    res.render('components/orders/addOrder', { tables, products,companyInfo });
  } catch (err) {
    console.error('Error fetching tables/products:', err);
    res.status(500).send('Error fetching data');
  }
};


exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, email, tableId, productId, qty, rate, amount, description, grossAmount, taxAmount, discount } = req.body;
    console.log("Request Body: ",req.body);
    
    const storeId = req.storeId; 
    const pendingStatus = await Orderstatus.findOne({ statusName: 'Pending' });
    if (!pendingStatus) throw new Error('Pending status not found');

    const taxAmountValue = parseFloat(taxAmount) || 0;
    const discountValue = parseFloat(discount) || 0;
    const netAmount = parseFloat(grossAmount) + (parseFloat(grossAmount) * taxAmountValue / 100) - discountValue;

    const order = new Order({
      customerName,
      customerPhone,
      email,
      tableId,
      products: productId.map((id, index) => ({ productId: id, qty: qty[index], rate: rate[index], amount: amount[index] })),
      description,
      grossAmount: parseFloat(grossAmount),
      taxAmount: taxAmountValue,
      discount: discountValue,
      netAmount,
      orderstatusId: pendingStatus._id,
      storeId,
      
    });

    await order.save();

    // Fetch the table name
    const table = await Table.findById(tableId).select('tableName');

    // Create a notification for the new order
    const notification = new Notification({
      message: `New order created  ${table.tableName}`,
      orderId: order._id,
      storeId
    });

    await notification.save();

    const occupiedStatus = await Tablestatus.findOne({ statusName: 'Occupied' });
    if (!occupiedStatus) throw new Error('Occupied status not found');
    await Table.findByIdAndUpdate(tableId, { tablestatusId: occupiedStatus._id });

    req.flash('successMessage', 'Order Created Successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('Error creating order:', error);
    req.flash('errorMessage', 'Failed to Create Order');
    res.redirect('/orders/add');
  }
};


exports.showEditOrderForm = async (req, res) => {
    const availableTable = await Tablestatus.findOne({ statusName: 'Available' });
    const companyInfo = req.companyInfo;
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
      res.render('./components/orders/editOrder', { order, products,orderstatus,tables,companyInfo });
    } catch (err) {
      console.error(err);
      req.flash('errorMessage', 'Error loading the order details');
      res.redirect('/orders');
    }
};

exports.updateOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, email, tableId, productId, qty, rate, amount, description, grossAmount, taxAmount, discount, orderstatusId } = req.body;
    console.log("Update Order Request Body:", req.body);
    const storeId = req.storeId;
    const taxAmountValue = parseFloat(taxAmount) || 0;
    const discountValue = parseFloat(discount) || 0;
    const netAmount = parseFloat(grossAmount) + (parseFloat(grossAmount) * taxAmountValue / 100) - discountValue;

    const updatedProducts = productId.map((id, index) => ({ productId: id, qty: qty[index], rate: rate[index], amount: amount[index] }));

    // Update the order and populate the orderstatusId field
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { customerName, customerPhone, email, tableId, products: updatedProducts, description, grossAmount, taxAmount: taxAmountValue, discount: discountValue, netAmount, orderstatusId, storeId },
      { new: true }
    ).populate('orderstatusId tableId'); // Populate orderstatusId and tableId

    console.log("Update Order: ", updatedOrder);

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    // Check if the order status is "Completed"
    if (updatedOrder.orderstatusId.statusName === 'Completed') {
      // Find the "Available" table status
      const availableStatus = await Tablestatus.findOne({ statusName: 'Available' });
      if (!availableStatus) {
        throw new Error('Available table status not found');
      }
      
      // Update the table status to "Available"
      await Table.findByIdAndUpdate(
        updatedOrder.tableId._id,
        { tablestatusId: availableStatus._id }
      );
    }

    // Create a notification for the order status update
    const notification = new Notification({
      message: `Order status updated to ${updatedOrder.orderstatusId.statusName} for ${updatedOrder.tableId.tableName}`,
      orderId: updatedOrder._id,
      storeId
    });
    await notification.save();

    req.flash('successMessage', 'Order Updated Successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('Error updating order:', error);
    req.flash('errorMessage', 'Failed to Update Order');
    res.redirect(`/orders/edit/${req.params.id}`);
  }
};



exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.flash('successMessage', 'Order Deleted Successfully!');
    res.redirect('/orders');
  } catch (error) {
    console.error('Error deleting order:', error);
    req.flash('errorMessage', 'Failed to Delete Order');
    res.redirect('/orders');
  }
};

exports.viewOrder = async (req, res) => {
  try {
    const companyInfo = req.companyInfo;
    const storeId = req.storeId; 
    const companyinfo = await CompanyInfo.find({storeId});
    const order = await Order.findById(req.params.id)
      .populate('tableId', 'tableName')
      .populate('orderstatusId', 'statusName')
      .populate('products.productId', 'productName')
      .populate('companyInfoId', 'companyName');
    
    if (!order) {
      req.flash('errorMessage', 'Order not found');
      return res.redirect('/orders');
    }
    res.render('./components/orders/viewOrder', { order, title: 'Order Details', companyinfo,companyInfo });
  } catch (error) {
    console.error('Error fetching order details:', error);
    req.flash('errorMessage', 'Failed to fetch order details');
    res.redirect('/orders');
  }
};


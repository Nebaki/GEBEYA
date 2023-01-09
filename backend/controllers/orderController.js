const mongoose = require("mongoose");
const Order = require("../model/order");
const errorHandler=require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncErrors");
const APIfeatures=require("../utils/apiFeatures");




//create new order  =>/api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const{
        orderItem,
        shippingInfo,itemPrice,taxPrice,shippingPrice,totalPrice,paymentInfo

    }=req.body;

    const order=await Order.create({
        orderItem,
        shippingInfo,itemPrice,taxPrice,shippingPrice,totalPrice,paymentInfo,paidAt:Date.now(),user:req.user.id
    });

    res.status(200).json({
        success:true,
        order
    })
  });


  //get all orders from databse /api/v1/orders?keyword=apple
exports.getAllOrder = catchAsyncError(async (req, res) => {
    const resPerPage=5;
    const OrderCount=await Order.countDocuments();
    const apiFeatures=new APIfeatures(Order.find(),req.query).Search().Filter().Pagination(resPerPage)
    const orderList = await apiFeatures.query;
    if (!orderList) {
      return next(new errorHandler("order not found",404));
    }
    res.status(200).json({
      success: true,
      count: orderList.length,
      OrderCount,
      orderList,
    });
  });





  //get single order    =>/api/v1/order/:ID
exports.getSingleOrder = catchAsyncError(async (req, res,next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email ');
  
    if (!order) {
      return next(new errorHandler("The Order with the given id was not found!",404))
      
    }
    res.status(200).json({
      success: true,
      order,
    });
  });


   //get my  orders using ID from databse /api/v1/orders/me
exports.myOrders = catchAsyncError(async (req, res,next) => {
  const orders = await Order.find({
    user:req.user.id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});
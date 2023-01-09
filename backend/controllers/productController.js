const mongoose = require("mongoose");
const Product = require("../model/product");
const errorHandler=require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncErrors");
const APIfeatures=require("../utils/apiFeatures");

//create new product  =>/api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  req.body.user=req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({ success: true, product });
});

//get all products from databse /api/v1/allProducts?keyword=apple
exports.getAllProduct = catchAsyncError(async (req, res) => {
  const resPerPage=5;
  const productCount=await Product.countDocuments();
  const apiFeatures=new APIfeatures(Product.find(),req.query).Search().Filter().Pagination(resPerPage)
  const productList = await apiFeatures.query;
  if (!productList) {
    return next(new errorHandler("Product not found",404));
  }
  res.status(200).json({
    success: true,
    count: productList.length,
    productCount,
    productList,
  });
});

//get single  products using ID from databse /api/v1/Product/:ID
exports.getSingleProduct = catchAsyncError(async (req, res,next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new errorHandler("The product with the given id was not found!",404))
    
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Update single  products using ID from database /api/v1/admin/Product/:ID
exports.updateProduct = catchAsyncError(async (req, res,next) => {
  let product = await Product.findById(req.params.id);
  if (!product)
  return next(new errorHandler("Product not found",404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, product });
});


//Delete single  products using ID from database /api/v1/admin/Product/:ID
exports.deleteProduct =catchAsyncError(async (req,res)=>{
  let product = await Product.findById(req.params.id);
  if (!product){
    return next(new errorHandler("Product not found",404));}

    await product.remove();
    res.status(200).json({
      success:true,
      message:"product is deleted." 
    })

}
)

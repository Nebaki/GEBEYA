const User = require("../model/user");
const errorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require(`../utils/sendEmail`);
const crypto = require("crypto");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { error } = require("console");




//Register user   =>/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avater: {
      public_id: "c250dffebc14d54a0eea2a28101100d8",
      url: "https://asset.cloudinary.com/dpqgiqfaa/c250dffebc14d54a0eea2a28101100d8",
    },
  });

  sendToken(user, 200, res);
});

//Login user =>/api/v1/login

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password entered by the user
  if (!email || !password) {
    return next(new errorHandler("Please enter email and password", 400));
  }

  //Finding the user in database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorHandler("Invalid Email or Password", 401));
  }

  //check if password is correct

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new errorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

//forgot password   =>api/v1/password/forgot

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new errorHandler("User not found with this email", 404));
  }
  //Get reset token

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //create reset password url

  const ressetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your reset password token is \n\n${ressetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Gebeya Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email is sent to${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = "Undefined";
    user.resetPasswordExpire = "Undefined";
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset password   =>api/v1/password/reset/:token

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user =await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new errorHandler("Invalid Token or Expired", 400));
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new errorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken =undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});


//Get currently logged in user   from /api/v1/me
exports.getUserProfile=catchAsyncErrors(async (req,res,next)=>{
  const user=await User.findById(req.user.id).select(`-role`);
  res.status(200).json({
    success:true,
    user
  })
})

//Update /change password =>/api/v1/password/update
exports.updatePassword=catchAsyncErrors(async (req,res,next)=>{
  const user= await User.findById(req.user.id).select(`+password`);

  const isMatched=await user.comparePassword(req.body.oldPassword);
  if(!isMatched){
    return next(new errorHandler("Old password is incorrect",400));

  }

  if(req.body.password.length<6){
    return next(new errorHandler(" password should be greater than/equal to 6 didgits",400));
  }

  user.password=req.body.password;
  user.save();
  sendToken(user,200,res);
})




//Logout user =>/api/v1/logout

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httponly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});




//Admin routes


//Get all users    =>/api/v1/admin/users
exports.GetAllUsers=catchAsyncErrors(async (req,res,next)=>{
  const users=await User.find();
  res.status(200).json({
    success:true,
    users
  })

})

//Get user      =>/api/v1/admin/user/:id
exports.getSinglUser = catchAsyncError(async (req, res,next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new errorHandler("The user with the given id was not found!",404))
    
  }
  res.status(200).json({
    success: true,
    user,
  });
});
     
//Update Userusing ID from database =>/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res,next) => {
  let user = await User.findById(req.params.id);
  if (!user)
  return next(new errorHandler("User is not found",404));

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, user });
});

//Delete single user using ID from database /api/v1/admin/user/:ID
exports.deleteUser =catchAsyncError(async (req,res,next)=>{
  let user = await User.findById(req.params.id);
  if (!user){
    return next(new errorHandler("user is not found",404));}

    await user.remove();
    res.status(200).json({
      success:true,
      message:"User is removed from DB!!!" 
    })

}
)
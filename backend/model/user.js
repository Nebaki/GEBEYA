const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const crypto=require('crypto')
const ErrorHandler = require('../utils/errorHandler');

const userSchema=mongoose.Schema({
name:{
    type:String,
    required:[true,"Please enter your name"],
    maxLength:[30,"name cannot exceed 30 characters"],
    
},
email:{
    type:String,
    required:[true,"Please enter your email"],
    validator:[validator.isEmail,"Please enter a valid email address"], 
    unique:true,
    trim:true,

},
password:{
    type:String,
    required:[true,"Please enter your password"],
    minlength:[6,"your password must be longer than 6 characters"],
    select:false
},
avater:{
    public_id:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    }
},
role:{
    type:String,
    default:"user"

},
createdAt:{
    type: Date,
        default: Date.now
},
resetPasswordToken:String,
resetPasswordExpire:Date


})


//Encrypting the user password before saving 
userSchema.pre('save',async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password= await bcrypt.hash(this.password,10);
    });

//compare user password

userSchema.methods.comparePassword =async function(password) {
    return await bcrypt.compareSync(password,this.password);
}


//Return jwt token   
userSchema.methods.getJwtToken=function() {
    return jwt.sign({id:this.id,},process.env.JWT_SECRETE,{
        expiresIn: process.env.JWT_SECRETE_EXPIRATION_TIME
    });
}



//Generate password reset token

userSchema.methods.getResetPasswordToken=function(){
    //Generate Token
    const resetToken=crypto.randomBytes(20).toString('hex');

    //Hash and set to reset Token
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    //set token expire time

    this.resetPasswordExpire=Date.now()+30*60*1000


    return resetToken;


}


module.exports=mongoose.model('User',userSchema);


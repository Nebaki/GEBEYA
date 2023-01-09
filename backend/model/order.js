const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    shippingInfo:{
        address:{
            type: 'string',
            required:true
        },
        city:{
            type: 'string',
            required:true
        },
        phoneNo:{
            type: 'string',
            required:true
        },
        postalCode:{
            type: 'string',
            required:true
        },
        country:{
            type: 'string',
            required:true
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    orderItem:[
      {
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'product'
        },
      }
    ],
    paymentInfo:{
        id:{
            type:String,
        },
        status:{
            type:String,
        }
    },
    paidAt:{
        type:Date,
    },
    itemPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
            required:true,
            default:'processing'
    },
    deliveredAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model("order", orderSchema);
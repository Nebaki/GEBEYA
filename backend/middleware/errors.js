const ErrorHandler=require("../utils/errorHandler")


module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"Internal Server Error";
    if(process.env.NODE_ENV=="DEVELOPMENT"){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errorMessage:err.message,
            stack:err.stack
        })
    }
    if(process.env.NODE_ENV=="PRODUCTION"){
        let error={...err};
        error.message=err.message;
        if(err.name==="CastError"){
            const message=`Resource not found .Invalid: ${err.path}`;
            error=new ErrorHandler(message,400)
        }



        //Worng mongoose object ID error

        

        
        //Handling mongoose validation Error
        
        if (err.name==='ValidationError') {
            const message=Object.values(err.errors).map(values=>values.message);
            error=new ErrorHandler(message,400)
            
        }
        
        //Handling mongoose duplicate key error
        if(err.code==11000){
            const message=`Duplicate ${Object.keys(err.keyValue)} entered.`
            error=new ErrorHandler(message,400);
        }
        //Handling worng jwt error
        if(err.name==='JsonWebTokenError'){
            const message="JSon Web Token is invalid. Try Again !!!";
            error=new ErrorHandler(message,400)
        }

        //Handling Expired jwt error
        if(err.name==='TokenExpiredError'){
                    const message="JSon Web Token is expired. Try Again !!!";
                    error=new ErrorHandler(message,400)
                }
        
        //Handling Invalid jwt error

        res.status(error.statusCode).json({
            status:false,
            message:error.message||err.message,
        });
    }

    
}
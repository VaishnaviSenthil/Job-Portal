const ErrorResponse = require('../utils/errorResponse')


const errorHandler=(err,req,res,next)=>{

    let error = {...err};
    error.message = err.message;

    if(err.name==="CustError"){
        const message = `Resource not found ${err.value}`;
        err = new ErrorResponse(message,404)
    }

    // mongoose duplicate 
    if(err.code===11000){
        const message = "Duplicate value entered";
        err = new ErrorResponse(message,400)
    }

    // mongoose duplicate 
    if(err.name==="Validation"){
        const message = Object.value(err.errors).map(val=>" "+val.message);
        err = new ErrorResponse(message,400)
    }

    res.status(error.codeStatus || 500).json({
        success : false,
        error : error.message || "Server Error"
    })
}

module.exports = errorHandler;
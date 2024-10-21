const JobType = require('../models/jobTypeModel');
const ErrorResponse = require('../utils/errorResponse');

exports.createJobType = async (req,res,next)=>{
    try {
        console.log(req.body);
        const jobT = await JobType.create({
            jobType: req.body.jobTypeName,
            user:req.user._id
        });
        res.status(201).json({
            success:true,
            jobT
        })
    } catch (error) {
        next(error);
        
    }
}


exports.allJobTypes = async (req,res,next)=>{
    try {
        const jobT = await JobType.find();
        res.status(200).json({
            success:true,
            jobT
        })
    } catch (error) {
        next(error);
        
    }
}

exports.updateJobType = async (req,res,next)=>{
    try {
        console.log("JOB TYPE",req.body)
        const jobT = await JobType.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json({
            success:true,
            jobT
        })
    } catch (error) {
        next(error);
        
    }
}

exports.deleteJobType = async (req,res,next)=>{
    try {
        const jobT = await JobType.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success:true,
            message:"Deleted successfuly"
        })
    } catch (error) {
        next(new ErrorResponse("Server Error",500));
        
    }
}
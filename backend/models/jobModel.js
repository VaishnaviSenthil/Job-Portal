const mongoose =require('mongoose');
const {ObjectId} = mongoose.Schema



const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        trim : true,
        required :[true,'title is required'],
        maxlength:70,
    },
    company:{
        type: String,
        trim : true,
        required :[true,'Company name is required'],
        maxlength:70,
    },
    description:{
        type: String,
        trim : true,
        required :[true,'Description is required'],
        maxlength:70,
    },
    skills: {
        type: String, 
        
      },
    salary:{
        type: String,
        trim : true,
        required :[true,'Salary is required'],
        maxlength:70,
    },
    location:{
        type: String,
    },
    deadline:{
        type:Date,
    },
    available:{
        type:Boolean,
        default: true
    },
    jobCategory:{
        type:String,
    },
    jobType:{
        type:ObjectId,
        ref:"JobType",
        // required:true
    },
    user:{
        type:ObjectId,
        ref:"User",
        // required:true
    },
    deleted:{
        type:String,
        default:false
    }
    
},{timestamps:true})



module.exports = mongoose.model("Job",jobSchema)
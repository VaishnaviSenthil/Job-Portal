const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {ObjectId} = mongoose.Schema;


const jobsHistorySchema = new mongoose.Schema({
    title:{
        type: String,
        trim : true,
        maxlength:70,
    },
    company:{
        type: String,
        trim : true,
        maxlength:70,
    },
    description:{
        type: String,
        trim : true,
        maxlength:256,
    },
    skills:{
        type:String,
        default:""
    },
    salary:{
        type: String,
        trim : true,
        maxlength:15,
    },
    location:{
        type: String,
    },
    applicationStatus:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    },
    JobCategory:{
        type:String,
    },
    jobType:{
        type:ObjectId,
        ref:"JobType",
    },
    user:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    jobId:{
        type:String,
       
        
    },
    favorite: {
        type: Boolean,
        default: false,
      },
    
},{timestamps:true})





const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        trim : true,
        required :[true,'first name is required'],
        maxlength:31,
    },
     lastName:{
        type: String,
        trim : true,
        // required :[true,'last name is required'],
        maxlength:31,
    }, 
    email:{
        type: String,
        trim : true,
        required :[true,'email is required'],
       unique : true,
       match :[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please provide valid email"]
    },
    password:{
        type: String,
        trim : true,
        // required :[true,'password is required'],
        minlength:[6,'password should be more than 6 characters'],
    }, 
    mobileNumber:{
        type: Number,
        trim : true,
        // required :[true,'mobile number is required'],
        minlength:[10,'Enter valid mobile number'],
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    state:{
        type:String
    }, 
    city:{
        type:String

    },
    dateOfBirth:{
        type:Date
    },
    jobHistory:[jobsHistorySchema],
    role:{
        type:Number,
        default: 0,
    },
    school:{
            type: String,
            default:"",
        },
    college:{
            type:String,
            default:"",
        }

    ,
    skills:[{
        type:String,
        default:"Graduate"
    }],
    experience:{
        type:Number,
        default:0,
    },

    resumePath: {
        type: String,
    }
    ,
    about:{
        type:String,
        maxlength:256,
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    }
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getJWTToken =function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:3600
    })
}

userSchema.methods.getJobCountsByDate = async function (startDate, endDate) {
    const jobCountsByDate = [];
    const jobHistory = this.jobHistory;
  
    for (const job of jobHistory) {
      const jobDate = job.createdAt;
      
      if (jobDate >= startDate && jobDate <= endDate) {
        const date = jobDate.toISOString().split('T')[0];
        const existingDate = jobCountsByDate.find((entry) => entry.date === date);
  
        if (existingDate) {
          existingDate.count += 1;
        } else {
          jobCountsByDate.push({ date, count: 1 });
        }
      }
    }
  
    return jobCountsByDate;
  };

module.exports = mongoose.model("User",userSchema)
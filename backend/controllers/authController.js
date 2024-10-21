const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const nodemailer = require('nodemailer')

exports.signup = async (req, res, next) => {
  console.log("Req body", req.body);
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorResponse("Email already exist", 400));
  }
  try {
    const user = await User.create(req.body);
    console.log(user);
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email) {
      return next(new ErrorResponse("please add an email", 403));
    }
    if (!password) {
      return next(new ErrorResponse("please add a password", 403));
    }

    //check user email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("invalid credentials", 400));
    }
    //check password
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return next(new ErrorResponse("invalid credentials", 400));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJWTToken();
  const firstName = user.firstName;
  const role = user.role;
  const userId = user._id;
  const accessTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  res
    .status(codeStatus)
    .cookie("token", token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .json({ success: true, token, role, firstName, userId, accessTokenExpiry });
};

exports.userProfile = async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const perPage = 6;
  const applicationStatus = req.query.applicationStatus;
  const showFavorites = req.query.showFavorites === "true";

  try {
    console.log("IDDDDD", req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    let jobHistory = user.jobHistory;

    if (applicationStatus) {
      jobHistory = jobHistory.filter(
        (job) => job.applicationStatus === applicationStatus
      );
    }

    if (showFavorites) {
      jobHistory = jobHistory.filter((job) => job.favorite);
    }

    jobHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const jobHistoryCount = jobHistory.length;
    const totalPages = Math.ceil(jobHistoryCount / perPage);

    const paginatedJobHistory = jobHistory.slice(
      (page - 1) * perPage,
      page * perPage
    );

    res.status(200).json({
      success: true,
      user,
      jobHistory: paginatedJobHistory,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching user job history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  "56033284269-nk4tng8cmkleg9foqeekbfpflr6efqji.apps.googleusercontent.com"
);

exports.googleLogin = async (req, res, next) => {
    const { tokenId } = req.body;
    // console.log(tokenId);
  
    try {
      const response = await client.verifyIdToken({
        idToken: tokenId,
        audience: "56033284269-nk4tng8cmkleg9foqeekbfpflr6efqji.apps.googleusercontent.com",
      });
  
      const { email_verified, name, email } = response.payload;
  
      if (email_verified) {
        const user = await User.findOne({ email });
  
        if (user) {
          res.status(200).json({email:user.email,password:user.email})
        } else {
          let password = email;
          let firstName = name;
          let newUser = new User({ firstName, email, password });
  
          const savedUser = await newUser.save();
          console.log("SavedUser",savedUser);
          res.status(200).json({email:savedUser.email,password:savedUser.email})
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: "Something went wrong...",
      });
    }
  };
  

  exports.resetToken = async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        res.status(404).json({message:"Email not registered yet"});
    }

    const token = Math.random().toString(36).slice(-8);

    user.resetPasswordToken=token;
    user.resetPasswordExpires= Date.now()+3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"akilanrm29@gmail.com",
            pass:"bphc dfkc tfwj zrzo"
        }
    })

    const message = {
        from:"akilanrm29@gmail.com",
        to:user.email,
        subject:"Password Reset Request",
        text:`You receiving this mail to reset your password. \n\n Please use the following token ${token} to reset your password`
    }

    transporter.sendMail(message,(err,info)=>{
        if(err){
            res.status(400).json({message:"Something went wrong try again"})
        }
        res.status(200).json({message:'Email sent'+info.response})
    })
  }

//
  exports.resetPassword = async (req, res, next) => {
    const {token} = req.params;
    const {password} = req.body;

    const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpires: {$gt:Date.now()}
    })

    if(!user){
        res.status(404).json({message:"Invalid Token"})
    }

    user.password=password;
    user.resetPasswordToken="";
    user.resetPasswordExpires="";

    await user.save();
    res.json({message:"Password changed successfully"})
  }
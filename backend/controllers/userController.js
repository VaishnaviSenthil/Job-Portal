const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

// load all users

exports.allUsers = async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.find({}).estimatedDocumentCount();

  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password")
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.status(200).json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// single user
exports.singleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
    next();
  } catch (error) {
    return next(error);
  }
};

// edit user

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join( __dirname,'..','uploads')); 
  },
  filename: function (req, file, cb) {
    cb(null,`${req.user.email}.pdf`);
  },
});

const upload = multer({ storage: storage }).single('resume');

exports.editUser = async (req, res, next) => {
  try {
    console.log("Req**",req)
    upload(req, res, async (err) => {
      
      if (err) {
        return res.status(400).json({ success: false, message: 'File upload failed.' });
      }

      
      const resumeFile = req.file;

      let updateData = req.body;
      
      if (resumeFile) {
        updateData.resumePath = `${req.user.email}.pdf`;
      }

      
      const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

      res.status(200).json({
        success: true,
        user,
      });
    });
  } catch (error) {
    return next(error);
  }
};

// delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "User Deleted",
    });
    next();
  } catch (error) {
    return next(error);
  }
};

//User Job History Apply for Job

exports.jobHistory = async (req, res, next) => {
  const {jobId, title, company, description, skills, salary, location } = req.body;

  try {
  
    const currentUser = await User.findOne({ _id: req.user._id });
    

    if (!currentUser.skills || !currentUser.college || !currentUser.school || !currentUser.experience) {
      return next(new ErrorResponse("Complete your profile creation with skills, college, school, and experience before applying for a job", 400));
    }

    if(!currentUser.resumePath){
      return next(new ErrorResponse("Please upload your resume to apply for this job",400))
    }
   
    const duplicate = currentUser.jobHistory.some((job) => job.jobId === jobId);
    
    if (!currentUser) {
      return next(new ErrorResponse("Log in to do further action", 401));
    } 
    else if (duplicate){
      return next(new ErrorResponse("Already applied for job", 400));
    }
    else {
      console.log("Inside Else Block");
      const addJobHistory = {
        title,
        company,
        description,
        skills,
        salary,
        location,
        user: req.user._id,
        jobId
        
      };
      console.log(addJobHistory);
      currentUser.jobHistory.push(addJobHistory);
      await currentUser.save();
    }
    res.status(200).json({
      success: true,
      currentUser
    });
    next();
  } catch (error) {
    console.log("Inside Error")
    return next(error);
  }
};


exports.appliedUsers = async (req, res) => {
  try {
    // Define the query conditions based on query parameters
    const queryConditions = { 'jobHistory.0': { $exists: true } };

    if (req.query.title) {
      queryConditions['jobHistory.title'] = { $regex: new RegExp(req.query.title, 'i') };
    }

    if (req.query.company) {
      queryConditions['jobHistory.company'] = { $regex: new RegExp(req.query.company, 'i') };
    }

    if (req.query.startDate && req.query.endDate) {
      const startDateObj = new Date(req.query.startDate);
      const endDateObj = new Date(req.query.endDate);

      // Check if the end date is greater than the start date
      if (endDateObj <= startDateObj) {
        return res.status(400).json({ message: 'End Date must be greater than Start Date' });
      }
      queryConditions['jobHistory'] = {
        $elemMatch: {
          createdAt: {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate),
          },
        },
      };
    }

    const users = await User.find(queryConditions).lean();

    users.forEach((user) => {
      if (user.jobHistory) {
        user.jobHistory = user.jobHistory.filter((job) => {
          if (req.query.title && !job.title.match(new RegExp(req.query.title, 'i'))) {
            return false;
          }
          if (req.query.company && !job.company.match(new RegExp(req.query.company, 'i'))) {
            return false;
          }
          if (req.query.startDate && req.query.endDate) {
            const jobDate = new Date(job.createdAt);
            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);
    
            if (jobDate < startDate || jobDate > endDate) {
              return false;
            }
          }
          return true;
        });
      }
    });

    const filteredUsers = users.filter((user) => user.jobHistory && user.jobHistory.length > 0);

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUserApplicationStatus = async (req, res) => {
  const { userId, jobHistoryId } = req.params;
  const { applicationStatus } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    
    const jobHistory = user.jobHistory.id(jobHistoryId);
    if (!jobHistory) {
      return res.status(404).json({ message: 'Job history not found' });
    }

    jobHistory.applicationStatus = applicationStatus;
    await user.save();

    return res.status(200).json({ message: 'Application status updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};



// resume controller



const fs = require('fs');
exports.resumeController = async(req, res) => {

  const file = req.params.filePath;

  const filePath = path.join( __dirname,'..','uploads',file)
  

  const fileStream = fs.createReadStream(filePath);

  res.setHeader('Content-Type',"application/pdf");
  fileStream.pipe(res)
  
}




// Admin status for number of users accepted , rejected , pending


exports.countUsersByApplicationStatus = async (req, res) => {
  try {
    const aggregationResult = await User.aggregate([
      {
        $unwind: '$jobHistory'
      },
      {
        $group: {
          _id: {
            status: '$jobHistory.applicationStatus'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    aggregationResult.forEach(item => {
      if (item._id.status === 'Pending') result.pending = item.count;
      else if (item._id.status === 'Accepted') result.accepted = item.count;
      else if (item._id.status === 'Rejected') result.rejected = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error counting users by application status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// user Graph
const { startOfDay, subDays, format } = require('date-fns');
const { parseISO } = require('date-fns');
exports.getUserJobCountsByDate = async (req, res) => {
  const { userId } = req.params;
 console.log("Called")
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentDate = new Date();

    // Calculate the start date for the query (7 days ago from the current date)
    const sevenDaysAgo = subDays(startOfDay(currentDate), 7);

    // Call a function to retrieve job counts within the date range
    const jobCountsByDate = await user.getJobCountsByDate(sevenDaysAgo, currentDate);

    // Transform the response to match the desired format
    const transformedResponse = jobCountsByDate.map((item) => ({
      date: format(parseISO(item.date), 'yyyy-MM-dd'), 
      count: item.count,
    }));

    return res.status(200).json(transformedResponse);
  } catch (error) {
    console.error('Error getting job counts by date:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// date search


exports.getUsersWithAppliedJobs = async (req, res) => {
  try {
    const { startDate, endDate } = req.body; 
     if (endDate <= startDate) {
      return res.status(400).json({ message: 'End Date must be greater than Start Date' });
    }
    const users = await User.find({
      'jobHistory.createdAt': {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users with applied jobs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// generate pdf report

const pdf = require('pdfkit');
const moment = require('moment');

exports.generateJobApplied = async (req, res) => {
  const { userId } = req.params;
  const { applicationStatus } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let jobHistory = user.jobHistory;

    if (applicationStatus) {
      // Filter jobHistory based on applicationStatus if provided
      jobHistory = jobHistory.filter((job) => job.applicationStatus === applicationStatus);
    }

    if (jobHistory.length === 0) {
      return res.status(204).json({ message: 'No content found' });
    }

    const pdfDoc = new pdf();

    const pdfPath = path.join(__dirname, '..', 'userJobHistory', `user_${userId}${applicationStatus ? `_${applicationStatus}` : ''}_jobs.pdf`);

    pdfDoc.pipe(fs.createWriteStream(pdfPath));

    // Add content to the PDF
    pdfDoc.text(`Applied Jobs Report for: ${user.firstName} ${user.lastName}${applicationStatus ? ` (Status: ${applicationStatus})` : ''}`);
    pdfDoc.text(" ");
    let count = 1;
    for (const job of jobHistory) {
      pdfDoc.text(`${count}.) Date Applied: ${moment(job.createdAt).format('DD MMM YYYY')}`);
      pdfDoc.text(`Role: ${job.title}`);
      pdfDoc.text(`Company: ${job.company}`);
      pdfDoc.text(`Salary: ${job.salary}`);
      pdfDoc.text(`Application Status: ${job.applicationStatus}`);
      count += 1;
      pdfDoc.text(' ')
    }

    pdfDoc.end();

    return res.status(200).sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error sending PDF file:', err);
        return res.status(500).json({ message: 'Error sending PDF file' });
      }

      console.log('PDF file sent successfully:', pdfPath);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// filter by title and company

exports.getUsersByJobHistory = async (req, res) => {
  try {
    const { title, company } = req.query;

    const query = {};

    if (title) {
      query['jobHistory.title'] = { $regex: new RegExp(title, 'i') };
    }

    if (company) {
      query['jobHistory.company'] = { $regex: new RegExp(company, 'i') };
    }

    query.jobHistory = { $exists: true, $not: { $size: 0 } };

    const users = await User.find(query);

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by job history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



const puppeteer = require('puppeteer');

async function generateAPDF(user, jobHistory) {
  try {const htmlContent = `
    <html>
      <body>
        <h1>${user.firstName}'s Applied Job Details</h1>
        <h2>User Details:</h2>
        <p>Name: ${user.firstName} ${user.lastName}</p>
        <p>Email: ${user.email}</p>
        <p>Mobile Number: ${user.mobileNumber}</p>
        <p>Skills: ${user.skills}</p>
        <p>Experience: ${user.experience} years</p>
        <p>About: ${user.about}</p>
        <h2>Applied Job Details:</h2>
        <ul>
          ${jobHistory
            .map(
              (job) => `
                <li>
                  Applied On : ${moment(job.createdAt).format('DD MMM YYYY')}
                  Job Title: ${job.title}
                  Company: ${job.company}
                  Location: ${job.location}
                  Salary: ${job.salary}
                 <b> Status: ${job.applicationStatus}</b>
                </li>
                <br />
              `
            )
            .join('')}
        </ul>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer;
} catch (error) {
  console.error('Error generating PDF for user:', user.firstName, user.lastName);
  console.error(error);
  throw error;  // Rethrow the error to be caught in the calling function
}
}



const archiver = require('archiver');
// const fs = require('fs');
async function generateZipArchive(users, res) {
  const zipFileName = 'user_reports.zip';
  const output = fs.createWriteStream(zipFileName);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

    // Now that the archive is created successfully, we can send it to the client
    res.contentType('application/zip');
    res.download(zipFileName, 'user_reports.zip', (err) => {
      if (err) {
        console.error('Error sending ZIP archive:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
      } else {
        // Cleanup the generated ZIP file after it's sent
        fs.unlink(zipFileName, (err) => {
          if (err) {
            console.error('Error deleting ZIP file:', err);
          }
        });
      }
    });
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  for (const user of users) {
    const pdfBuffer = await generateAPDF(user, user.jobHistory);
    archive.append(pdfBuffer, { name: `${user.firstName}_${user.lastName}_report.pdf` });
  }

  archive.finalize();
}

exports.generateAllUserReports = async (req, res) => {
  try {
    const users = await User.find({ firstName: { $ne: 'Admin' } });
    await generateZipArchive(users, res);
  } catch (error) {
    console.error('Error generating ZIP archive:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// favorites

exports.toggleFavoriteJob = async (req, res) => {
  const userId = req.user._id;
  const jobId = req.params.jobId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobIndex = user.jobHistory.findIndex((job) => job._id == jobId);

    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job not found in user job history' });
    }

    user.jobHistory[jobIndex].favorite = !user.jobHistory[jobIndex].favorite;
    await user.save();
    
    res.status(200).json({ message: 'Job favorite status updated successfully', user });
  } catch (error) {
    console.error('Error updating job favorite status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Recomandation 
const Job = require('../models/jobModel');

exports.fetchJobsBasedOnSkills = async (req, res) => {
  try {
    const userSkill = req.user.skills[0];
    const currentDate = new Date();
    const userSkills = userSkill.split(',');
  

    const jobs = await Job.find({
      available: true,
      deleted:false, 
      deadline: { $gte: currentDate },
      $or: userSkills.map((skill) => ({
        skills: { $regex: new RegExp(skill, 'i') },
      })),
    }).populate('jobType');

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs based on user skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
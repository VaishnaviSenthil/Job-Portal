const Job = require('../models/jobModel');
const JobType = require('../models/jobTypeModel');
const ErrorResponse = require('../utils/errorResponse');

exports.createJob = async (req,res,next)=>{
    try {
        const job = await Job.create({
            title:req.body.title,
            company:req.body.company,
            description:req.body.description,
            skills:req.body.skills,
            salary:req.body.salary,
            location:req.body.location,
            deadline:req.body.deadline,
            available:req.body.available,
            jobCategory:req.body.jobCategory,
            jobType:req.body.jobType,
            user:req.user.id
        });
        res.status(201).json({
            success:true,
            job
        })
    } catch (error) {
        next(error);
        
    }
}


exports.singleJob = async (req,res,next)=>{
    try {
        const job = await Job.findById(req.params.id);
        res.status(200).json({
            success:true,
            job
        })
    } catch (error) {
        next(error);
        
    }
}


exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('jobType', 'jobType').populate('user', 'firstName lastName');
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


exports.deleteJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        // Update the job to mark it as deleted
        const job = await Job.findByIdAndUpdate(jobId, { deleted: true}, { new: true });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job marked as deleted by admin',
        });
    } catch (error) {
        next(error);
    }
};



exports.showJobs = async (req, res, next) => {

   
    const currentDate = new Date();
    const keyword = req.query.keyword ? {
      $or: [
        {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        },
        {
            company: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        },
    ],
        available: true,
        deleted:false, 
        deadline: { $gte: currentDate },
      }
    : { available: true,
         deleted:false, 
        deadline: { $gte: currentDate },
     };


    // filter by category
    let ids = [];
    const jobTypeCategory = await JobType.find({},{_id:1})
    jobTypeCategory.forEach(cat=>{
        ids.push(cat._id)
    })
    let cat = req.query.cat;
    let categ= cat !== ''? cat : ids


    // jobs by location
    let locations = [];
    const jobByLocation = await Job.find({}, { location: 1 });
    jobByLocation.forEach(val => {
        locations.push(val.location);
    });
    let setUniqueLocation = [...new Set(locations)];
    let location = req.query.location;
    let locationFilter = location !== '' ? location : setUniqueLocation;


    //enable pagination
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    //const count = await Job.find({}).estimatedDocumentCount();
    const count = await Job.find({ ...keyword, jobType: categ, location: locationFilter }).countDocuments();

    try {
        const jobs = await Job.find({ ...keyword, jobType: categ, location: locationFilter }).populate('jobType', 'jobType').populate('user', 'firstName').sort({ createdAt: -1 }).skip(pageSize * (page - 1)).limit(pageSize)
        res.status(200).json({
            success: true,
            jobs,
            page,
            pages:Math.ceil(count/pageSize),
            count,
            setUniqueLocation
        })
    } catch (error) {
        next(error);
    }
}


exports.showAllJobs = async(req, res, next) => {
    try{
        const jobs = await Job.find({deleted:false }).populate('jobType', 'jobType');
        res.status(200).json(
            {success: true,
            jobs});

    }catch(error){
        next(error)
    }

}

exports.jobsOnDay = async (req, res) => {
  try {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setHours(0, 0, 0, 0);
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const jobsData = await Job.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    let weekType = 'currentWeek';

    // Check if data for the last 7 days is empty
    if (jobsData.length === 0) {
      // If no data, fetch data for the previous 7 days
      const prevEndDate = new Date(startDate);
      startDate.setDate(startDate.getDate() - 7);
      const prevJobsData = await Job.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: prevEndDate,
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            date: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      // Update the week type flag
      weekType = 'previousWeek';

      // Send the appropriate data or an empty array
      res.json({ data: prevJobsData, weekType });
    } else {
      res.json({ data: jobsData, weekType });
    }
  } catch (error) {
    console.error('Error fetching jobs data for the last 7 days:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




    // jobs report


const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const fetchJobs = async (keyword,location, startDate, endDate) => {
    try {
      const query = {};
  
      // Apply filters based on provided parameters
      if (keyword && keyword !== 'undefined' && keyword !== '') {
        query.title = { $regex: keyword, $options: 'i' };
      }
      if (location && location !== 'undefined' && location !== '') {
        query.location = location;
      }
      if (startDate && endDate && startDate !== 'undefined' && endDate !== 'undefined' && startDate !== '' && endDate !== '') {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
  
      // Fetch jobs based on the filters
      console.log("Query **",query)
      const jobs = await Job.find(query)
        .populate('jobType', 'jobType')
        .populate('user', 'firstName');
     
      return jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Error fetching jobs');
    }
  };
  

  exports.generateJobReport = async (req, res) => {
    const { keyword, location, startDate, endDate } = req.query;
  
    const jobs = await fetchJobs(keyword, location, startDate, endDate);
  
    if (jobs.length === 0) {
      console.log("NO CONTENT SEND");
      return res.status(204).json({ message: 'No content to generate pdf' });
    }
  
    const pdfPath = path.join(__dirname, '..', 'JobsPdf', 'jobs_report.pdf');
    const pdfDoc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
  
    pdfDoc.pipe(stream);
  
    // Set font and font size
    pdfDoc.font('Helvetica-Bold');
    pdfDoc.fontSize(12);
  
    // Define table headers
    const headers = ['Company', 'Title', 'Location', 'Salary'];
  
    // Define column widths and calculate total width
    const columnWidths = [150, 150, 150, 100];
    const tableWidth = columnWidths.reduce((total, width) => total + width, 0);
  
    // Define y position
    let yPosition = 100;
  
    // Draw table headers
    pdfDoc.rect(50, yPosition, tableWidth, 20).fill('#000000'); // Header background
    pdfDoc.fill('#ffffff').text('Job Report', 50, yPosition + 5);
    yPosition += 20;
  
    pdfDoc.fill('#000000');
    for (let i = 0; i < headers.length; i++) {
      pdfDoc.text(headers[i], 50 + sumArray(columnWidths, i), yPosition);
    }
  
    yPosition += 20; // Move to the next row
  
    // Draw table content
    pdfDoc.font('Helvetica');
    for (const job of jobs) {
      for (let i = 0; i < headers.length; i++) {
        pdfDoc.text(job[headers[i].toLowerCase()], 50 + sumArray(columnWidths, i), yPosition);
      }
      yPosition += 20; // Move to the next row
    }
  
    // Finalize the PDF
    pdfDoc.end();
  
    console.log("Sending File");
    return res.status(200).sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error sending PDF file:', err);
        return res.status(500).json({ message: 'Error sending PDF file' });
      }
  
      console.log('PDF file sent successfully:', pdfPath);
    });
  };
  
  // Helper function to sum an array up to a given index
  function sumArray(arr, index) {
    return arr.slice(0, index).reduce((sum, val) => sum + val, 0);
  }



const User = require('../models/userModel');

// upload
exports.uploadCsv = async (req, res) => {
  const csvData = req.body.data;

  try {
    const jobsToCreate = await Promise.all(
      csvData.map(async (row) => {
        // Fetch the ObjectId for the user based on their email (assuming email is unique)
        const user = await User.findOne({ email: row.user });
        console.log("User",user)
        if (!user) {
          return res.status(400).json({ error: `User not found for email: ${row.user}` });
        }

        // Fetch the ObjectId for the jobType based on its name (assuming name is unique)
        const jobType = await JobType.findOne({ jobType: row.jobType });
        console.log("JobType",jobType)
        if (!jobType) {
          return res.status(400).json({ error: `JobType not found for name: ${row.jobType}` });
        }

        return {
          title: row.title,
          company: row.company,
          description: row.description,
          salary: row.salary,
          location: row.location,
          user: user._id, 
          jobType: jobType._id, 
        };
      })
    );

    // Create jobs in the database
    await Job.create(jobsToCreate);

    res.json({ message: 'CSV data stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error storing CSV data', details: error.message });
  }
};


// company - jobs

exports.countJobsByCompany = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: { 
          _id: '$company',
          jobCount: { $sum: 1 },
          jobTitles: { $addToSet: '$title' },
        },
      },
      {
        $project: {
          _id: 0,
          companyName: '$_id',
          jobCount: 1,
          jobTitles: 1,
        },
      },
    ];

    const jobCounts = await Job.aggregate(pipeline);

    res.json(jobCounts);
  } catch (error) {
    console.error('Error counting jobs by company:', error);
    res.status(500).json({ error: 'Error counting jobs by company' });
  }
};
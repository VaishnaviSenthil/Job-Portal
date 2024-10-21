const express = require('express');
const router = express.Router();
const { isAuthenticated , isAdmin} = require('../middleware/auth');
const { createJob, singleJob, updateJob, deleteJob, showJobs, showAllJobs, jobsOnDay, generateJobReport, uploadCsv, countJobsByCompany } = require('../controllers/jobsController');




router.post('/job/create',isAuthenticated,isAdmin,createJob);
router.get('/job/:id',isAuthenticated,singleJob);
router.get('/jobs/show',showJobs);
router.get('/jobs/company',countJobsByCompany);
router.get('/jobs/generatePdf',isAuthenticated,generateJobReport);
router.get('/jobs/showAll',isAuthenticated,showAllJobs);
router.get('/jobsPostedOnDate',isAuthenticated,jobsOnDay);
router.post('/upload',isAuthenticated,uploadCsv);
router.put('/job/update/:id',isAuthenticated,isAdmin,updateJob);
router.delete('/job/delete/:id',isAuthenticated,isAdmin,deleteJob);



// swagger

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Operations related to job management managed by Admin Only
 */

/**
 * @swagger
 * /api/job/create:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a new job.
 *     description: Create a new job posting. (JWT authorization required and Admin access only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the job.
 *                 example: "Software Engineer"
 *               company:
 *                 type: string
 *                 description: Company name.
 *                 example: "Acme Corporation"
 *               description:
 *                 type: string
 *                 description: Job description.
 *                 example: "We are looking for a skilled software engineer to join our team."
 *               skills:
 *                 type: string
 *                 description: Required skills.
 *                 example: "JavaScript, Node.js, React"
 *               salary:
 *                 type: string
 *                 description: Salary offered.
 *                 example: "70,000"
 *               location:
 *                 type: string
 *                 description: Job location.
 *                 example: "San Francisco, CA"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline (in YYYY-MM-DD format).
 *                 example: "2023-12-31"
 *               available:
 *                 type: boolean
 *                 description: Job availability.
 *                 example: true
 *               jobCategory:
 *                 type: string
 *                 description: Job category.
 *                 example: "Information Technology"
 *               jobType:
 *                 type: string
 *                 description: Job type.
 *                 example: "Full-Time"
 *               user:
 *                 type: string
 *                 description: User who created the job.
 *                 example: "65115f8420d329daf4089303"
 *             required:
 *               - title
 *               - company
 *               - description
 *               - salary
 *               - deadline
 *               - jobCategory
 *               - jobType
 *     responses:
 *       '200':
 *         description: Job created successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/job/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get a job by ID.
 *     description: Retrieve a job by its ID. (JWT authorization required)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the job to retrieve.
 *         example: "651a50b33332b0b936b856b6"
 *         required: true
 *     responses:
 *       '200':
 *         description: Job retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               job:
 *                 _id: "651a50b33332b0b936b856b6"
 *                 title: "Data Analyst"
 *                 company: "Soft Corp"
 *                 description: "Full-stack developer position"
 *                 skills: "JavaScript, React"
 *                 salary: "70000"
 *                 location: "New York, NY"
 *                 deadline: "2023-11-09T00:00:00.000Z"
 *                 available: true
 *                 jobType: "651a514f3332b0b936b856b9"
 *                 user: "65115f8420d329daf4089303"
 *                 createdAt: "2023-10-02T05:10:11.984Z"
 *                 updatedAt: "2023-11-01T07:55:38.994Z"
 *                 __v: 0
 *                 jobCategory: "Full-Time"
 *                 deleted: "false"
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '404':
 *         description: Job not found.
 *       '500':
 *         description: Internal server error.
 */



/**
 * @swagger
 * /api/jobs/show:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get a list of jobs.
 *     description: Retrieve a list of job postings.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Jobs retrieved successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/jobs/showAll:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get all jobs.
 *     description: Retrieve all job postings. (JWT authorization required and Admin access only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: All jobs retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               jobs:
 *                 - _id: "651a50b33332b0b936b856b6"
 *                   title: "Data Analyst"
 *                   company: "Soft Corp"
 *                   description: "Full-stack developer position"
 *                   skills: "JavaScript, React"
 *                   salary: "70000"
 *                   location: "New York, NY"
 *                   deadline: "2023-11-09T00:00:00.000Z"
 *                   available: true
 *                   jobType:
 *                     _id: "651a514f3332b0b936b856b9"
 *                     jobType: "Data"
 *                   user: "65115f8420d329daf4089303"
 *                   createdAt: "2023-10-02T05:10:11.984Z"
 *                   updatedAt: "2023-11-01T07:55:38.994Z"
 *                   __v: 0
 *                   jobCategory: "Full-Time"
 *                   deleted: "false"
 *                 - _id: "651a516a3332b0b936b856bc"
 *                   title: "Data Analyst"
 *                   company: "ABC Solutions"
 *                   description: "Analyze and interpret complex data sets"
 *                   skills: "SQL, Python"
 *                   salary: "70000"
 *                   location: "Chennai"
 *                   deadline: "2023-12-01T00:00:00.000Z"
 *                   available: true
 *                   jobType:
 *                     _id: "651a514f3332b0b936b856b9"
 *                     jobType: "Data"
 *                   user: "65115f8420d329daf4089303"
 *                   createdAt: "2023-10-02T05:13:14.153Z"
 *                   updatedAt: "2023-10-27T07:37:46.545Z"
 *                   __v: 0
 *                   jobCategory: "Full-Time"
 *                   deleted: "false"
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Upload a CSV file to add jobs.
 *     description: Upload a CSV file containing job details to add new job postings.(JWT authorization required and Admin access only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: CSV file uploaded and jobs added successfully.
 *       '400':
 *         description: Bad request. The CSV file format is incorrect.
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/job/update/{id}:
 *   put:
 *     tags:
 *       - Jobs
 *     summary: Update a job by ID.
 *     description: Update an existing job posting by its ID.(JWT authorization required and Admin access only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the job to update.
 *         example: "651a50b33332b0b936b856b6"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the job.
 *                 example: "Software Engineer"
 *               company:
 *                 type: string
 *                 description: Company name.
 *                 example: "Acme Corporation"
 *               description:
 *                 type: string
 *                 description: Job description.
 *                 example: "We are looking for a skilled software engineer to join our team."
 *               skills:
 *                 type: string
 *                 description: Required skills.
 *                 example: "JavaScript, Node.js, React"
 *               salary:
 *                 type: string
 *                 description: Salary offered.
 *                 example: "70,000"
 *               location:
 *                 type: string
 *                 description: Job location.
 *                 example: "San Francisco, CA"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline (in YYYY-MM-DD format).
 *                 example: "2023-12-31"
 *               available:
 *                 type: boolean
 *                 description: Job availability.
 *                 example: true
 *               jobCategory:
 *                 type: string
 *                 description: Job category.
 *                 example: "Information Technology"
 *               jobType:
 *                 type: string
 *                 description: Job type.
 *                 example: "Full-Time"
 *     responses:
 *       '200':
 *         description: Job updated successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '404':
 *         description: Job not found.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/job/delete/{id}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job by ID.
 *     description: Delete a job posting by its ID.(JWT authorization required and Admin access only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the job to delete.
 *         example: "651a50b33332b0b936b856b6"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Job deleted successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '404':
 *         description: Job not found.
 *       '500':
 *         description: Internal server error.
 */

module.exports = router;








const express = require('express');
const router = express.Router();
const {allUsers,singleUser, editUser, deleteUser, jobHistory, appliedUsers, updateUserApplicationStatus, resumeController, countUsersByApplicationStatus, getUserJobCountsByDate, getUsersWithAppliedJobs, generateJobApplied, getUsersByJobHistory, generateUserPDF, generateAllUserReports, favorite, toggleFavoriteJob, fetchJobsBasedOnSkills} = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const {OAuth2Client}= require("google-auth-library")



//user routes//


router.get('/allUsers',isAuthenticated,isAdmin,allUsers);
router.get('/recomandation',isAuthenticated,fetchJobsBasedOnSkills);
router.get('/user/:id',isAuthenticated,singleUser);
router.get('/generateAllUserReports',isAuthenticated,generateAllUserReports);
router.put('/user/edit/:id',isAuthenticated,editUser);
router.delete('/admin/user/delete/:id',isAuthenticated,isAdmin,deleteUser);
router.post('/user/jobApply',isAuthenticated,jobHistory);
router.post('/user/addFavorite/:jobId',isAuthenticated,toggleFavoriteJob);

// for getting applied users Admin
router.get('/appliedUsers',isAuthenticated,isAdmin,appliedUsers);
router.get('/appliedUsers/status',isAuthenticated,isAdmin,countUsersByApplicationStatus);
router.get('/filter/users',isAuthenticated,isAdmin,getUsersByJobHistory);
router.get('/userResume/:filePath',isAuthenticated,resumeController);
router.put('/updateStatus/:userId/jobHistory/:jobHistoryId',isAuthenticated,isAdmin,updateUserApplicationStatus);
  
//

router.get('/users/:userId',isAuthenticated, getUserJobCountsByDate );
router.get('/generatePdf/:userId',isAuthenticated,generateJobApplied);
router.post('/usersWithAppliedJobs',isAuthenticated,getUsersWithAppliedJobs);


const UserModel = require("../models/userModel");

// Function to check if a user exists in the database
async function userExists(email) {
    const user = await UserModel.findOne({ email });
    return user !== null;
}

// Function to store a new user in the database
async function storeUser(data) {
    const newUser = new UserModel(data);
    await newUser.save();
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJWTToken();
    const { firstName, role, _id: userId } = user; 
    res.status(codeStatus)
        .cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        }).redirect(303, 'http://localhost:3000/userProfile');;
};

// Modified getUserData function
async function getUserData(req, res, access_token) {
    console.log("AccessToken******", access_token);

    // Fetch user profile data from the Google API userinfo endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    
    if (response.ok) {
        const data = await response.json();
        console.log("User Profile", data);

        const { name, email, picture, gender } = data;

        // Check if the user already exists in the database
        const userExistsInDB = await userExists(email);

        if (userExistsInDB) {
            // User exists, perform the necessary actions (e.g., allow login)
            console.log('User exists in the database. Allowing login...');
            
            
        } else {
            // User does not exist, store them in the database
            // Adjust this part based on your database schema and model
            // For example:
            await storeUser({
                firstName: name,
                email,
            });
            console.log('User does not exist. Storing in the database...');
            
            // Assuming you just stored the user, fetch the user from the database
            const newUser = await UserModel.findOne({ email });
            
            // Call sendTokenResponse with the user object
            await sendTokenResponse(newUser, 200, res);
        }

        // Continue with your existing code to display user information
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Picture: ${picture}`);
        console.log(`Gender: ${gender}`);
    } else {
        console.error("Failed to fetch user profile");
    }
}

router.get('/googleSignin', async function(req, res, next) {
    const code = req.query.code;
    console.log("Signing INNNN")

    console.log(code);
    try {
        const redirectURL = "http://localhost:9000/api/googleSignin"
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURL
        );
        const r =  await oAuth2Client.getToken(code);
        // Make sure to set the credentials on the OAuth2 client.
        await oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        const user = oAuth2Client.credentials;
        console.log('credentials',user);
        await getUserData(req, res, user.access_token);
    } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
    }
});


// swagger 
/**
 * @swagger
 * tags:
 *   name: Users Route
 *   description: Endpoints for managing user-related operations
 * @swagger
 * tags:
 *   name: Admin Route
 *   description: Endpoints for managing admin-related operations

 * /api/allUsers:
 *   get:
 *     tags: [Admin Route]
 *     summary: Get all users.
 *     description: Retrieve a list of all users (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of applied users retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               users: [
 *                 {
 *                   _id: "654278db9e0d4b119bbf3338",
 *                   firstName: "Gayu",
 *                   lastName: "Gayu",
 *                   email: "gayu@gmail.com",
 *                   mobileNumber: 6379357839,
 *                   gender: "male",
 *                   state: "TamilNadu",
 *                   city: "Chennai",
 *                   dateOfBirth: "+020001-10-31T18:30:00.000Z",
 *                   role: 0,
 *                   school: "",
 *                   college: "",
 *                   skills: [],
 *                   experience: 0,
 *                   jobHistory: [],
 *                   createdAt: "2023-11-01T16:12:11.091Z",
 *                   updatedAt: "2023-11-01T16:12:11.091Z",
 *                   __v: 0
 *                 },
 *                 {
 *                   _id: "6536103c30a304317ce940ed",
 *                   firstName: "Karthi",
 *                   lastName: "Karthi",
 *                   email: "karthi123@gmail.com",
 *                   mobileNumber: 6379357839,
 *                   gender: "male",
 *                   state: "Tamil Nadu",
 *                   city: "Chennai",
 *                   dateOfBirth: "2001-03-29T00:00:00.000Z",
 *                   role: 0,
 *                   school: "Velammal ",
 *                   college: "CEG",
 *                   skills: ["Java, Nodejs"],
 *                   experience: 2,
 *                   jobHistory: [
 *                     {
 *                       title: "SalesForce Tester",
 *                       company: "Hibiz Solutions",
 *                       description: "As a salesForce developer with 3 yrs experience",
 *                       skills: "",
 *                       salary: "40000",
 *                       location: "Chennai",
 *                       applicationStatus: "Pending",
 *                       user: "6536103c30a304317ce940ed",
 *                       jobId: "651e926297492c864736942b",
 *                       favorite: false,
 *                       _id: "6536107b30a304317ce94130",
 *                       createdAt: "2023-10-23T06:19:39.934Z",
 *                       updatedAt: "2023-10-23T06:19:39.934Z"
 *                     },
 *                     {
 *                       title: "Devops Manager",
 *                       company: "Basic Solutions",
 *                       description: "Need good experience and good knowledge in devops management",
 *                       skills: "",
 *                       salary: "35000",
 *                       location: "Bengaluru",
 *                       applicationStatus: "Pending",
 *                       user: "6536103c30a304317ce940ed",
 *                       jobId: "651e933097492c8647369454",
 *                       favorite: false,
 *                       _id: "6536108030a304317ce9413c",
 *                       createdAt: "2023-10-23T06:19:44.669Z",
 *                       updatedAt: "2023-10-23T06:19:44.669Z"
 *                     },
 *                     {
 *                       title: "dev's Solution",
 *                       company: "BZ Company",
 *                       description: "Frontend",
 *                       skills: "",
 *                       salary: "45000",
 *                       location: "Chennai",
 *                       applicationStatus: "Pending",
 *                       user: "6536103c30a304317ce940ed",
 *                       jobId: "651bf05beac0e6c467249bea",
 *                       favorite: false,
 *                       _id: "6536108930a304317ce94182",
 *                       createdAt: "2023-10-23T06:19:53.566Z",
 *                       updatedAt: "2023-10-23T06:19:53.566Z"
 *                     },
 *                     {
 *                       title: "FullStack Developer",
 *                       company: "HCL",
 *                       description: "Both knowledge in frontend and backend needed",
 *                       skills: "",
 *                       salary: "60000",
 *                       location: "Chennai",
 *                       applicationStatus: "Pending",
 *                       user: "6536103c30a304317ce940ed",
 *                       jobId: "651e91b397492c8647369402",
 *                       favorite: false,
 *                       _id: "6536108e30a304317ce94196",
 *                       createdAt: "2023-10-23T06:19:58.373Z",
 *                       updatedAt: "2023-10-23T06:19:58.373Z"
 *                     }
 *                   ],
 *                   createdAt: "2023-10-23T06:18:36.553Z",
 *                   updatedAt: "2023-10-23T06:19:58.374Z",
 *                   __v: 4,
 *                   about: "Seeking for a job",
 *                   resumePath: "karthi123@gmail.com.pdf"
 *                 }
 *               ]
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.
 * /api/user/{id}:
 *   get:
 *     tags: [Users Route]
 *     summary: Get their profile by ID.
 *     description: Retrieve a user by their ID (JWT authorization required).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to retrieve.
 *         example: "651d347e43f694e5039434cb"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user: {
 *                 _id: "651d347e43f694e5039434cb",
 *                 firstName: "Akilan",
 *                 lastName: "Ramachandran",
 *                 email: "akilanrm29@gmail.com",
 *                 mobileNumber: 6379357839,
 *                 gender: "male",
 *                 state: "Tamil Nadu",
 *                 dateOfBirth: "2001-03-28T18:30:00.000Z",
 *                 role: 0,
 *                 school: "Velammal",
 *                 college: "CEG",
 *                 skills: ["Sql, Data Visualization, Node.js"],
 *                 experience: 2,
 *                 jobHistory: [
 *                   {
 *                     title: "Data Analyst",
 *                     company: "ABC Solutions",
 *                     description: "Analyze and interpret complex data sets",
 *                     skills: "SQL, Python, Data Visualization",
 *                     salary: "70000",
 *                     location: "New York, NY",
 *                     applicationStatus: "Rejected",
 *                     user: "651d347e43f694e5039434cb",
 *                     jobId: "651a516a3332b0b936b856bc",
 *                     _id: "651d34bf43f694e5039434f8",
 *                     createdAt: "2023-10-27T09:47:43.969Z",
 *                     updatedAt: "2023-11-01T09:42:22.244Z",
 *                     favorite: false
 *                   },
 *                   {
 *                     title: "Backend Developer",
 *                     company: "IBM",
 *                     description: "We are looking for a skilled Backend Developer.",
 *                     skills: "Node.js , MongoDB",
 *                     salary: "60,000 - 80,000",
 *                     location: "Chennai,TamilNadu",
 *                     applicationStatus: "Accepted",
 *                     user: "651d347e43f694e5039434cb",
 *                     jobId: "651a52963332b0b936b856c5",
 *                     _id: "651d34c843f694e50394351a",
 *                     createdAt: "2023-10-29T09:47:52.045Z",
 *                     updatedAt: "2023-10-20T09:29:32.694Z",
 *                     favorite: false
 *                   },
 *                   {
 *                     title: "Software Tester",
 *                     company: "Accenture",
 *                     description: "Knowledge in testing tools and 3 to 4 years hands on experience needed",
 *                     skills: "Graduate",
 *                     salary: "65000",
 *                     location: "Chennai",
 *                     applicationStatus: "Accepted",
 *                     user: "651d347e43f694e5039434cb",
 *                     jobId: "651d37d643f694e5039436a3",
 *                     _id: "651d4fbcd794677367609ffc",
 *                     createdAt: "2023-10-24T11:42:52.873Z",
 *                     updatedAt: "2023-10-18T09:50:17.699Z",
 *                     favorite: false
 *                   }
 *                 ]
 *               }
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.


 * /api/user/edit/{id}:
 *   put:
 *     tags: [Users Route]
 *     summary: Edit user profile.
 *     description: Edit a user's profile by their ID (JWT authorization required).
 *     security:
 *       - BearerAuth: []  # JWT authorization required
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to edit.
 *         example: "651d347e43f694e5039434cb"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:  # Supports JSON data
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *                 example: "Akilan"
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *                 example: "Rams"
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "akilan@gmail.com"
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the user.
 *                 example: "6379357839"
 *               school:
 *                 type: string
 *                 description: School of the user.
 *                 example: "Velammal"
 *               college:
 *                 type: string
 *                 description: College of the user.
 *                 example: "CEG"
 *               skills:
 *                 type: string
 *                 description: Skills of the user.
 *                 example: "Java,Node"
 *               experience:
 *                 type: string
 *                 description: Experience of the user.
 *                 example: "3"
 *               about:
 *                 type: string
 *                 description: About the user.
 *                 example: "Young graduate seeking for job"
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - mobile
 *               - school
 *               - college
 *               - skills
 *               - experience
 *               - about
 *     responses:
 *       '200':
 *         description: User profile updated successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.

 * /api/admin/user/delete/{id}:
 *   delete:
 *     tags: [Admin Route]
 *     summary: Delete user by ID.
 *     description: Delete a user by their ID (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete.
 *         example: "651d347e43f694e5039434cb"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.

 * /api/user/jobApply:
 *   post:
 *     tags: [Users Route]
 *     summary: Apply for a job.
 *     description: Apply for a job (JWT authorization required).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job to apply for.
 *                 example: "651a50b33332b0b936b856b6"
 *               title:
 *                 type: string
 *                 description: Title of the job.
 *                 example: "Software Engineer"
 *               company:
 *                 type: string
 *                 description: Company of the job.
 *                 example: "Acme Corporation" 
 *               description:
 *                 type: string
 *                 description: Description of the job.
 *                 example: "We are looking for a skilled software engineer to join our team." 
 *               skills:
 *                 type: string
 *                 description: Skills required for the job.
 *                 example: "JavaScript, Node.js, React" 
 *               salary:
 *                 type: string
 *                 description: Salary offered for the job.
 *                 example: "70,000"
 *               location:
 *                 type: string
 *                 description: Location of the job.
 *                 example: "Chennai"
 *             required:
 *               - jobId
 *               - title
 *               - company
 *               - description
 *               - skills
 *               - salary
 *               - location
 *     responses:
 *       '200':
 *         description: Job applied successfully.
 *       '400':
 *         description: Bad request. Invalid or duplicate application.
 *       '401':
 *         description: Unauthorized. User is not authenticated or profile is incomplete.
 *       '500':
 *         description: Internal server error.
 * /api/appliedUsers:
 *   get:
 *     tags: [Admin Route]
 *     summary: Get applied users.
 *     description: Retrieve a list of users who have applied for jobs (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []  # JWT authorization required
 *     responses:
 *       '200':
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user: {
 *                 _id: "651d347e43f694e5039434cb",
 *                 firstName: "Akilan",
 *                 lastName: "Ramachandran",
 *                 email: "akilanrm29@gmail.com",
 *                 mobileNumber: 6379357839,
 *                 gender: "male",
 *                 state: "Tamil Nadu",
 *                 dateOfBirth: "2001-03-28T18:30:00.000Z",
 *                 role: 0,
 *                 school: "Velammal",
 *                 college: "CEG",
 *                 skills: ["Sql, Data Visualization, Node.js"],
 *                 experience: 2,
 *                 jobHistory: [
 *                   {
 *                     title: "Data Analyst",
 *                     company: "ABC Solutions",
 *                     description: "Analyze and interpret complex data sets",
 *                     skills: "SQL, Python, Data Visualization",
 *                     salary: "70000",
 *                     location: "New York, NY",
 *                     applicationStatus: "Rejected",
 *                     user: "651d347e43f694e5039434cb",
 *                     jobId: "651a516a3332b0b936b856bc",
 *                     _id: "651d34bf43f694e5039434f8",
 *                     createdAt: "2023-10-27T09:47:43.969Z",
 *                     updatedAt: "2023-11-01T09:42:22.244Z",
 *                     favorite: false
 *                   },
 *                   {
 *                     title: "Backend Developer",
 *                     company: "IBM",
 *                     description: "We are looking for a skilled Backend Developer.",
 *                     skills: "Node.js , MongoDB",
 *                     salary: "60,000 - 80,000",
 *                     location: "Chennai,TamilNadu",
 *                     applicationStatus: "Accepted",
 *                     user: "651d347e43f694e5039434cb",
 *                     jobId: "651a52963332b0b936b856c5",
 *                     _id: "651d34c843f694e50394351a",
 *                     createdAt: "2023-10-29T09:47:52.045Z",
 *                     updatedAt: "2023-10-20T09:29:32.694Z",
 *                     favorite: false
 *                   },
 *                   {
 *                     title: "Software Tester",
 *                     company: "Accenture",
 *                     description: "Knowledge in testing tools and 3 to 4 years hands on experience needed",
 *                     skills: "Graduate",
 *                     salary: "65000",
 *                     location: "Chennai",
 *                     applicationStatus: "Accepted",
 *                     user: "651d347e43f694e5039434cb",
 *                     jobId: "651d37d643f694e5039436a3",
 *                     _id: "651d4fbcd794677367609ffc",
 *                     createdAt: "2023-10-24T11:42:52.873Z",
 *                     updatedAt: "2023-10-18T09:50:17.699Z",
 *                     favorite: false
 *                   }
 *                 ]
 *               }
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '500':
 *         description: Internal server error.
 
 * /api/updateStatus/{userId}/jobHistory/{jobHistoryId}:
 *   put:
 *     tags: [Admin Route]
 *     summary: Update User Application Status.
 *     description: Update the application status of a user's job history (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []  # JWT authorization required
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user.
 *         example: "651d347e43f694e5039434cb"
 *         required: true
 *         schema:
 *           type: string
 *       - name: jobHistoryId
 *         in: path
 *         description: ID of the job history to update.
 *         example: "651a516a3332b0b936b856bc"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationStatus:
 *                 type: string
 *                 description: New status for the job application.
 *                 example: "Accepted"
 *             required:
 *               - status
 *     responses:
 *       '200':
 *         description: User application status updated successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.

 */



module.exports = router;

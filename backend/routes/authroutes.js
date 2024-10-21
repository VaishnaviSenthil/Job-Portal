const express = require('express');
const router = express.Router();
const { signup, signin, userProfile, logout, userJobProfile,googleLogin ,resetToken,resetPassword} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const {OAuth2Client}= require("google-auth-library")

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User sign-Up.
 *     description: Register a new user with the provided credentials.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *                 example: Akilan
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *                 example: Akil
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: akil001@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: Akil@0001
 *               mobileNumber:
 *                 type: string
 *                 description: Mobile number of the user.
 *                 example: 9090987876
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the user (in YYYY-MM-DD format).
 *                 example: 2001-01-01
 *               gender:
 *                 type: string
 *                 description: Gender of the user.
 *                 example: male
 *               state:
 *                 type: string
 *                 description: State where the user resides.
 *                 example: TamilNadu
 *               city:
 *                 type: string
 *                 description: City where the user resides.
 *                 example: Chennai
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request. Registration failed. (Email already exists)
 */


router.post('/signup', signup);



/**
 * @swagger
 * /api/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Login.
 *     description: Authenticate a user with provided email and password.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: akilanrm29@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: Akilan123
 *     responses:
 *       '200':
 *         description: User authenticated successfully.
 *       '400':
 *         description: Unauthorized. Authentication failed.
 */

router.post('/signin', signin);

/**
 * @swagger
 * /api/userProfile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get user profile.
 *     description: Retrieve user profile information for an authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 _id: "651d347e43f694e5039434cb"
 *                 firstName: "Akilan"
 *                 lastName: "Ramachandran"
 *                 email: "akilanrm29@gmail.com"
 *                 mobileNumber: 6379357839
 *                 gender: "male"
 *                 state: "Tamil Nadu"
 *                 dateOfBirth: "2001-03-28T18:30:00.000Z"
 *                 role: 0
 *                 school: "Velammal"
 *                 college: "CEG"
 *                 skills:
 *                   - "Sql"
 *                   - "Data Visulaization"
 *                   - "Node.js"
 *                 experience: 2
 *                 jobHistory:
 *                   - title: "Backend Developer"
 *                     company: "IBM"
 *                     description: "We are looking for a skilled Backend Developer."
 *                     skills: "Node.js, MongoDB"
 *                     salary: "60,000 - 80,000"
 *                     location: "Chennai, Tamil Nadu"
 *                     applicationStatus: "Accepted"
 *                     user: "651d347e43f694e5039434cb"
 *                     jobId: "651a52963332b0b936b856c5"
 *                     _id: "651d34c843f694e50394351a"
 *                     createdAt: "2023-10-29T09:47:52.045Z"
 *                     updatedAt: "2023-10-20T09:29:32.694Z"
 *                     favorite: false
 *       '401':
 *         description: Unauthorized. User not authenticated.
 */

router.get('/userProfile', isAuthenticated, userProfile);

/**
 * @swagger
 * /api/logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logout user.
 *     description: Log the user out of the system.
 *     responses:
 *       '200':
 *         description: User logged out successfully.
 */

router.get('/logout', logout);


// google oAuth

// router.post('/request',async function(req,res,next){
//     res.header('Access-Control-Allow-Orgin','http://localhost:9000');
//     res.header('Referrer-Policy','no-referer-when-downgrade')
//     const redirectUrl = 'http://localhost:9000/api/googleSignin';
//     const oAuth2Client = new OAuth2Client(
//         process.env.CLIENT_ID,
//         process.env.CLIENT_SECRET,
//         redirectUrl
//         )
    
//         const authorizeUrl = oAuth2Client.generateAuthUrl({
//             access_type:"offline",
//             scope:'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/user.phonenumbers.read',
//             prompt:'consent'
//         });

//         res.json({url:authorizeUrl})

// })


router.post('/googleLogin',googleLogin)

router.post('/resetToken',resetToken)
router.post('/resetPassword/:token',resetPassword)

module.exports = router;

const express = require('express');
const { createJobType, allJobTypes, updateJobType, deleteJobType } = require('../controllers/jobTypeController');
const router = express.Router();
const { isAuthenticated ,isAdmin } = require('../middleware/auth');




router.post('/type/create',isAuthenticated,isAdmin,createJobType);
router.get('/type/jobs',allJobTypes);
router.put('/type/update/:id',isAuthenticated,isAdmin,updateJobType);
router.delete('/type/delete/:id',isAuthenticated,isAdmin,deleteJobType);

/**
 * @swagger
 * tags:
 *   name: Job Types
 *   description: Operations related to job category management managed by Admin Only
 */

/**
 * @swagger
 * /api/type/create:
 *   post:
 *     tags: [Job Types]
 *     summary: Create a new job type.
 *     description: Create a new job type (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTypeName:
 *                 type: string
 *                 description: Name of the job type.
 *                 example: "Civil"
 *             required:
 *               - jobTypeName
 *     responses:
 *       '200':
 *         description: Job type created successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/type/jobs:
 *   get:
 *     tags: [Job Types]
 *     summary: Get all job types.
 *     description: Retrieve all available job types.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Job types retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               jobT: [
 *                 {
 *                   _id: "6511bdb2298be94c12c2fee0",
 *                   jobType: "Frontend",
 *                   user: "65115f8420d329daf4089303",
 *                   createdAt: "2023-09-25T17:04:50.245Z",
 *                   updatedAt: "2023-09-25T19:46:39.680Z",
 *                   __v: 0
 *                 },
 *                 {
 *                   _id: "6511be1d298be94c12c2fee3",
 *                   jobType: "Backend",
 *                   user: "65115f8420d329daf4089303",
 *                   createdAt: "2023-09-25T17:06:37.565Z",
 *                   updatedAt: "2023-09-25T17:06:37.565Z",
 *                   __v: 0
 *                 },
 *                 {
 *                   _id: "6511be25298be94c12c2fee6",
 *                   jobType: "Devops",
 *                   user: "65115f8420d329daf4089303",
 *                   createdAt: "2023-09-25T17:06:45.547Z",
 *                   updatedAt: "2023-09-25T17:06:45.547Z",
 *                   __v: 0
 *                 }
 *               ]
 *       '401':
 *         description: Unauthorized. User is not authenticated.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/type/update/{id}:
 *   put:
 *     tags: [Job Types]
 *     summary: Update a job type by ID.
 *     description: Update an existing job type by its ID (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the job type to update.
 *         example: "6511be1d298be94c12c2fee3"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobType:
 *                 type: string
 *                 description: Updated name of the job type.
 *                 example: "Civil"
 *             required:
 *               - jobType
 *     responses:
 *       '200':
 *         description: Job type updated successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/type/delete/{id}:
 *   delete:
 *     tags: [Job Types]
 *     summary: Delete a job type by ID.
 *     description: Delete a job type by its ID (JWT authorization required and Admin access only).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the job type to delete.
 *         example: "6511be1d298be94c12c2fee3"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Job type deleted successfully.
 *       '401':
 *         description: Unauthorized. User is not authenticated or doesn't have admin privileges.
 *       '403':
 *         description: Forbidden. User doesn't have admin privileges.
 *       '500':
 *         description: Internal server error.
 */



module.exports = router;

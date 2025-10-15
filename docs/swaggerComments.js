/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fullname:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         role:
 *           type: string
 *         profilepicture:
 *           type: string
 *           nullable: true
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout the currently logged-in user (destroy session)
 *     tags:
 *       - Users
 *     responses:
 *       302:
 *         description: Redirect to login page after logout
 *       500:
 *         description: Internal server error during logout
 */

/**
 * @swagger
 * /users/list:
 *   get:
 *     summary: Get a paginated list of users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of users returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 sortBy:
 *                   type: string
 *                 order:
 *                   type: string
 *                 role:
 *                   type: string
 *                 countrecord:
 *                   type: integer
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

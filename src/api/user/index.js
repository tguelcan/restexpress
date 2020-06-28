import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { masterman, validateUserBeforeCreate } from 's/auth'
import { schema } from './model'
export User, { schema } from './model'

import {
    index,
    showMe,
    show,
    create,
    update,
    updatePassword,
    destroy
} from './controller'

const router = new Router()
const { email, password, name, picture, role } = schema.tree
// TODO: Pagination docs
/**
 * @swagger
 * path:
 *  api/users/:
 *    get:
 *      summary: Get users
 *      tags: [Users]
 *      security:
 *        - jwtSessionToken
 *      responses:
 *        "200":
 *          description: A user schema array (fields depend on the ACL)
 *        "403":
 *          description: Missing permissions
 *        "404":
 *          description: User not found
 *        "500":
 *          description: Oh boi
 */
router.get('/', query(), index)

/**
 * @swagger
 * path:
 *  api/users/me:
 *    get:
 *      summary: Get current user
 *      tags: [Users]
 *      security:
 *        - jwtSessionToken
 *      responses:
 *        "200":
 *          description: A user schema (fields depend on the ACL)
 *        "403":
 *          description: Missing permissions
 *        "404":
 *          description: User not found
 *        "500":
 *          description: Oh boi
 */
router.get('/me', showMe)

/**
 * @swagger
 * path:
 *  api/users/{userId}:
 *    get:
 *      summary: Get user
 *      tags: [Users]
 *      security:
 *        - jwtSessionToken
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: string
 *          required: true
 *          description: ObjectId of the user to get
 *      responses:
 *        "200":
 *          description: A user schema (fields depend on the ACL)
 *        "403":
 *          description: Missing permissions
 *        "404":
 *          description: User not found
 *        "500":
 *          description: Oh boi
 */
router.get('/:id', show)

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * path:
 *  api/users/:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      security:
 *        - masterKey
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "201":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        "400":
 *          description: Invalid Body
 *        "401":
 *          description: Missing masterkey
 *        "403":
 *          description: Missing permissions
 *        "404":
 *          description: User not found
 *        "500":
 *          description: Oh boi
 */
router.post(
    '/',
    masterman(),
    validateUserBeforeCreate(),
    body({
        email,
        password,
        name,
        picture,
        role
    }),
    create
)

/**
 * @swagger
 * path:
 *  api/users/{userId}:
 *    put:
 *      summary: Update user
 *      tags: [Users]
 *      security:
 *        - jwtSessionToken
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: string
 *          required: true
 *          description: ObjectId of the user to update
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                picture:
 *                  type: string
 *                  format: uri
 *      responses:
 *        "200":
 *          description: User schema (fields depend on the ACL)
 *        "400":
 *          description: Invalid Body
 *        "403":
 *          description: Missing permissions
 *        "404":
 *          description: User not found
 *        "500":
 *          description: Oh boi
 */
router.put('/:id', body({ name, picture }), update)

/**
 * @swagger
 * path:
 *  api/users/{userId}/password:
 *    put:
 *      summary: Update user password
 *      tags: [Users]
 *      security:
 *        - jwtSessionToken
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: string
 *          required: true
 *          description: ObjectId of the user to update
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *      responses:
 *        "204":
 *          description: Successful update
 *        "400":
 *          description: Password doesn't match the requirements
 *        "403":
 *          description: Missing permissions
 *        "404":
 *          description: User not found
 *        "500":
 *          description: Oh boi
 */
router.put(
    '/:id/password',
    body({
        password
    }),
    updatePassword
)

router.delete('/:id', destroy)

export default router

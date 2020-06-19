import { hash, compareSync } from 'bcryptjs'
/**
 * Extract the given token from Header, Query or Body
 * @param {object} req - Incoming Request
 * @returns {string} The token.
 */
export const extractToken = req => {
    // Extract JWT from Header
    if (req.headers?.authorization?.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
    }

    // Extract JWT from Query
    if (req.query?.token) {
        return req.query.token
    }

    // Extract JWT from Body
    if (req.body?.token) {
        return req.body.token
    }

    return null
}

export const extractMaster = req => {

    // Extract JWT from Query
    if (req.query?.master) {
        return req.query.master
    }

    return null
}

/**
 * Validate Middleware - canot create user with another roles
 */
export const validateUserBeforeCreate = () => ({ body }, res, next) =>
	body?.role ? res.status(401).end() : next()

export const passwordValidator = {
    /**
	 * Password validator -
	 * The password must contain at least: 1 uppercase letter, 1 lowercase letter,
	 * 1 number, and one special character (E.g. , . _ & ? etc)
	 * @param {string} password - The password
	 * @returns {boolean} if the password is strong enough
	 */
    validator: function(password) {
        const strongRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
        )
        return strongRegex.test(password)
    },
    /**
	 * Send message if error
	 * @returns {string} message -
	 * The password must contain at least: 1 uppercase letter, 1 lowercase letter,
	 * 1 number, and one special character (E.g. , . _ & ? etc)
	 */
    message: () =>
        'The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)'
}

/**
 * Hash the Password with bcrypt
 * @param {string} password
 * @returns {Promise} The hashed password.
 */
export const hashPassword = async password => await hash(password, 9)

/**
 * Compare the bcrypt password
 * @param {string} password
 * @returns {Promise} The boolean compared return
 */
export const comparePassword = (password, comparePassword) => compareSync(password, comparePassword)

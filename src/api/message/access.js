import AccessControl from 'accesscontrol'
import AccessControlMiddleware from 's/auth/accessControl'

const ac = new AccessControl()
const endpoint = 'message'

// Docs: https://github.com/onury/accesscontrol#readme
// Api Docs: https://onury.io/accesscontrol/?api=ac

// Guest
ac.grant('guest')
	.readAny(endpoint, ['_id', 'content', 'author.name', 'author.picture'])
	.createAny(endpoint)

// User
ac.grant('user')
	.extend('guest')
	.createAny(endpoint)
	.deleteOwn(endpoint)

// Admin
ac.grant('admin')
	.extend('user')
	.updateAny(endpoint, ['content'])
	.deleteAny(endpoint)

const accessControlMiddleware = new AccessControlMiddleware(ac)

export default accessControlMiddleware
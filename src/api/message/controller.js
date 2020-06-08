import { merge } from 'lodash'
import { success, notFound } from 's/response'
import { Message } from '.'

// Get all
export const getAll = async ({ querymen, user, ability }, res, next) => {
	try {
		const messages = await Message.paginate(querymen, {
			ability,
			populate: 'author'
		})
		await success(res)(messages)
	} catch (error) {
		return next(error)
	}
}

// Get One
export const getOne = async ({ params: { id } }, res, next) => {
	try {
		const message = await Message.findById(id).lean()
		await notFound(res)(message)
		await success(res)(message)
	} catch (error) {
		return next(error)
	}
}

// Post
export const create = async ({ bodymen: { body }, permission }, res, next) => {
	try {
		const message = await Message.create(body)
		await success(res, 201)(message.toJSON())
	} catch (error) {
		return next(error)
	}
}

// Put
export const update = async (
	{ bodymen: { body }, params, permission },
	res,
	next
) => {
	try {
		const message = await Message.findOneAndUpdate({ _id: params.id }, body)
		await success(res, 204)(message.toJSON())
	} catch (error) {
		return next(error)
	}
}

// Delete
export const destroy = async ({ params: { id } }, res, next) => {
	try {
		await Message.deleteOne({ _id: id })
		await success(res, 204)
	} catch (error) {
		return next(error)
	}
}

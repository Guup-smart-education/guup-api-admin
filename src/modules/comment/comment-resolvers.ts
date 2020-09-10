import {
	// Gets
	GetCommentList,
	// Posts
	PostCreateComment,
	// Inputs
	IGetCommentCourse,
	IPostComment,
} from './comment'
import { serviceGetCommentsCourse, servicePostComment } from './comment-service'
import { AuthData } from './../../models/auth'

const reviewsResolvers = {
	Query: {
		getCommentByCourse: async (
			obj: any,
			{ course }: IGetCommentCourse,
			{ user }: AuthData
		): Promise<GetCommentList> => {
			return await serviceGetCommentsCourse(course, user)
		},
	},
	Mutation: {
		createComment: async (
			obj: any,
			{ collection, comment }: IPostComment,
			{ user: { uid, ...args } }: AuthData
		): Promise<PostCreateComment> => {
			return await servicePostComment({
				collection,
				comment: { ...comment, owner: uid, ownerProfile: { ...args } },
			})
		},
	},
}

export default reviewsResolvers

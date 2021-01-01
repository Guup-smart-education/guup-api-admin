import { ECommentTypesNames, CollectionComment } from './comment-enum'
import {
	// Gets
	GetCommentList,
	// Posts
	PostCreateComment,
	// Inputs
	IGetCommentCourse,
	IPostComment,
	IGetCommentPost,
} from './comment'
import {
	serviceGetCommentsCourse,
	serviceGetCommentsPost,
	servicePostComment,
} from './comment-service'
import { AuthData } from './../../models/auth'

const reviewsResolvers = {
	UGetComment: {
		__resolveType: (obj: GetCommentList, contex: any, info: any) => {
			if (obj.comments || obj.success) return ECommentTypesNames.GetComment
			if (obj.error) return ECommentTypesNames.ErrorResponse
			return null
		},
	},
	UPostComment: {
		__resolveType: (obj: PostCreateComment, contex: any, info: any) => {
			if (obj.comment || obj.success) return ECommentTypesNames.PostComment
			if (obj.error) return ECommentTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		getCommentByCourse: async (
			obj: any,
			{ course }: IGetCommentCourse,
			context: any
		): Promise<GetCommentList> => {
			return await serviceGetCommentsCourse(course)
		},
		getCommentByPost: async (
			obj: any,
			{ post, lastComment }: IGetCommentPost,
			context: any
		): Promise<GetCommentList> => {
			return await serviceGetCommentsPost(post, lastComment || '')
		},
	},
	Mutation: {
		createComment: async (
			obj: any,
			{ collection, comment }: IPostComment,
			{ user: { uid, profile } }: AuthData
		): Promise<PostCreateComment> => {
			return await servicePostComment({
				collection,
				comment: { ...comment, owner: uid },
			})
		},
	},
}

export default reviewsResolvers

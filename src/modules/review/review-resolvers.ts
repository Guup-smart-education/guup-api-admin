import {
	// Gets
	GetReviewList,
	// Posts
	PostCreateReview,
	// Inputs
	IGetReviewCourse,
	IGetReviewOwner,
	IPostReview,
} from './review'
import {
	serviceGetReviewsCourse,
	serviceGetReviewsOwner,
	servicePostReview,
} from './review-service'
import { AuthData } from './../../models/auth'

const reviewsResolvers = {
	Query: {
		getReviewByCourse: async (
			obj: any,
			{ course }: IGetReviewCourse
		): Promise<GetReviewList> => {
			return await serviceGetReviewsCourse({ course })
		},
		getReviewByOwner: async (
			obj: any,
			{ course, owner }: IGetReviewOwner,
			{ user: { uid } }: AuthData
		): Promise<GetReviewList> => {
			return await serviceGetReviewsOwner({ course, owner: owner || uid })
		},
	},
	Mutation: {
		createReview: async (
			obj: any,
			{ collection, review }: IPostReview,
			{ user: { uid, ...args } }: AuthData
		): Promise<PostCreateReview> => {
			return await servicePostReview({
				collection,
				review: { ...review, owner: uid, ownerProfile: { ...args } },
			})
		},
	},
}

export default reviewsResolvers

import { EReviewTypesNames } from './review-enum'
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
	UGetReview: {
		__resolveType: (obj: GetReviewList, contex: any, info: any) => {
			if (obj.reviews) return EReviewTypesNames.GetReview
			if (obj.error) return EReviewTypesNames.ErrorResponse
			return null
		},
	},
	UPostReview: {
		__resolveType: (obj: PostCreateReview, contex: any, info: any) => {
			if (obj.review) return EReviewTypesNames.PostReview
			if (obj.error) return EReviewTypesNames.ErrorResponse
			return null
		},
	},
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

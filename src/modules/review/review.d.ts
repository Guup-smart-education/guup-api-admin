import { EReviewTypesNames } from './review-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Review } from './../../entities/reviews'

enum CollectionReview {
	'COURSE' = 'COURSE',
	'POST' = 'POST',
}

interface TypeName {
	__typename: keyof typeof EReviewTypesNames
}

// Gets
export interface GetReviewList extends TypeName, success, error {
	reviews?: Array<Review> | []
}

// Posts
export interface PostCreateReview extends TypeName, success, error {
	review?: string
}

// Inputs
export interface IGetReviewCourse {
	course: string
}

export interface IGetReviewOwner {
	course: string
	owner?: string
}

export interface IPostReview {
	collection: keyof typeof CollectionReview
	review: Review
}

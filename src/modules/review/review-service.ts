import {
	GetReviewList,
	PostCreateReview,
	IGetReviewCourse,
	IGetReviewOwner,
	IPostReview,
} from './review'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError } from 'firebase-admin'
import R from 'ramda'
import { Review } from '../../entities/reviews'

// Get

export const serviceGetReviewsCourse = ({
	course,
}: IGetReviewCourse): Promise<GetReviewList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.doc(course || '')
			.collection(collections.reviews)
			.get()
			.then((data) => {
				let reviews: Array<Review> = []
				data.forEach((review) => {
					const item: Review = { id: review.id, ...review.data() }
					reviews.push(item)
				})
				resolve({
					__typename: 'GetReview',
					reviews,
					success: {
						message: R.isEmpty(reviews)
							? 'Is not reviews yet'
							: 'All reviews ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

export const serviceGetReviewsOwner = ({
	course,
	owner,
}: IGetReviewOwner): Promise<GetReviewList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.doc(course || '')
			.collection(collections.reviews)
			.where('owner', '==', owner)
			.get()
			.then((data) => {
				let reviews: Array<Review> = []
				data.forEach((review) => {
					const item: Review = { id: review.id, ...review.data() }
					reviews.push(item)
				})
				resolve({
					__typename: 'GetReview',
					reviews,
					success: {
						message: R.isEmpty(reviews)
							? 'Is not reviews yet'
							: 'All reviews ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

// Post

export const servicePostReview = ({
	collection,
	review: { post, ...args },
}: IPostReview): Promise<PostCreateReview> => {
	return new Promise((resolve, reject) => {
		const reviewRef = db.collection(
			collection === 'COURSE' ? collections.courses : collections.posts
		)
		reviewRef
			.doc(post || '')
			.collection(collections.reviews)
			.add(args)
			.then(({ id }) => {
				resolve({
					__typename: 'PostReview',
					review: id,
					success: {
						message: 'Review created successfully',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

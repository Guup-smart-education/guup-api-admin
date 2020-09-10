import { GetCommentList, PostCreateComment, IPostComment } from './comment'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError } from 'firebase-admin'
import R from 'ramda'
import { Comment } from '../../entities/comment'

// Get

export const serviceGetCommentsCourse = (
	course: string,
	ownerProfile: any
): Promise<GetCommentList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.doc(course)
			.collection(collections.comments)
			.get()
			.then((data) => {
				let comments: Array<Comment> = []
				data.forEach((comment) => {
					const item: Comment = {
						id: comment.id,
						...comment.data(),
						ownerProfile,
					}
					comments.push(item)
				})
				resolve({
					__typename: 'GetComment',
					comments,
					success: {
						message: R.isEmpty(comments)
							? 'Is not comments yet'
							: 'All comments ready',
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

export const servicePostComment = ({
	collection,
	comment: { post, ...args },
}: IPostComment): Promise<PostCreateComment> => {
	return new Promise((resolve, reject) => {
		const commentRef = db.collection(
			collection === 'COURSE' ? collections.courses : collections.posts
		)
		commentRef
			.doc(post || '')
			.collection(collections.comments)
			.add(args)
			.then(({ id: comment }) => {
				resolve({
					__typename: 'PostComment',
					comment,
					success: {
						message: 'Comment created successfully',
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

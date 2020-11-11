import { GetCommentList, PostCreateComment, IPostComment } from './comment'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError, firestore } from 'firebase-admin'
import R from 'ramda'
import { Comment } from '../../entities/comment'
import { Post } from '../../entities/post'
import { LIMIT_LIST } from '../../constants'

// Get

export const serviceGetCommentsPost = async (
	post: string,
	lastComment: string
): Promise<GetCommentList> => {
	const commentRef = db
		.collection(collections.posts)
		.doc(post)
		.collection(collections.comments)

	let snapShot: any = null
	if (lastComment) {
		snapShot = await commentRef.doc(lastComment).get()
	}
	const commentPageRef = snapShot
		? commentRef
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.tiny)
		: commentRef.orderBy('createdAt', 'desc').limit(LIMIT_LIST.tiny)
	return new Promise((resolve, reject) => {
		commentPageRef
			.get()
			.then((data) => {
				let comments: Array<Comment> = []
				data.forEach((comment) => {
					const dataComment: Comment = comment.data()
					const item: Comment = {
						id: comment.id,
						...dataComment,
						createdAt: dataComment.createdAt && dataComment.createdAt.toDate(),
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

export const serviceGetCommentsCourse = (
	course: string
): Promise<GetCommentList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.doc(course)
			.collection(collections.comments)
			.orderBy('createdAt')
			.get()
			.then((data) => {
				let comments: Array<Comment> = []
				data.forEach((comment) => {
					const item: Comment = {
						id: comment.id,
						...comment.data(),
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

export const servicePostComment = async ({
	collection,
	comment: { post, ...args },
}: IPostComment): Promise<PostCreateComment> => {
	const postRef = db
		.collection(
			collection === 'COURSE' ? collections.courses : collections.posts
		)
		.doc(post || '')
	const commentRef = await postRef.collection(collections.comments).get()
	await postRef.update({ commentsCount: commentRef.size + 1 })
	// Setting date createAt
	const createdAt = firestore.Timestamp.now()
	return new Promise((resolve, reject) => {
		postRef
			.collection(collections.comments)
			.add({ ...args, createdAt })
			.then(({ id }) => {
				resolve({
					__typename: 'PostComment',
					comment: {
						...args,
						id,
						createdAt: createdAt.toDate(),
					},
					success: {
						message: 'Comment created successfully',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
					comment: null,
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

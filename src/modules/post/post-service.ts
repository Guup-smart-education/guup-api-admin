import {
	// Get
	GetPost,
	GetPostList,
	// Post
	PostCreatePost,
	// Inputs
	IGetPostOwner,
	IGetPostID,
	ICreatePost,
} from './post'
import { ErrorGenerator, EErrorCode } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError } from 'firebase-admin'
import { Post } from '../../entities/post'
import R from 'ramda'

// Get

export const serviceGetPosts = (): Promise<GetPostList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.posts)
			.get()
			.then((posts) => {
				let allPost: Array<Post> = []
				posts.forEach((post) => {
					const item: Post = { id: post.id, ...post.data() }
					allPost.push(item)
				})
				resolve({
					__typename: 'GetPosts',
					allPost,
					success: {
						message: R.isEmpty(allPost) ? 'No posts yet' : 'All posts ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) =>
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			)
			.catch(({ code, message }: FirebaseError) => {
				reject(ErrorGenerator(code, message))
			})
	})
}

export const serviceGetPostsByOwner = ({
	owner,
}: IGetPostOwner): Promise<GetPostList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.posts)
			.where('owner', '==', owner)
			.get()
			.then((posts) => {
				let allPost: Array<Post> = []
				posts.forEach((post) => {
					const item: Post = { id: post.id, ...post.data() }
					allPost.push(item)
				})
				resolve({
					__typename: 'GetPosts',
					allPost,
					success: {
						message: R.isEmpty(allPost) ? 'No posts yet' : 'All posts ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) =>
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			)
			.catch(({ code, message }: FirebaseError) => {
				reject(ErrorGenerator(code, message))
			})
	})
}

export const serviceGetPostsByID = ({ id }: IGetPostID): Promise<GetPost> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.posts)
			.doc(id)
			.get()
			.then((data) => {
				resolve({
					__typename: 'GetPost',
					post: data.data(),
					success: {
						message: 'Post ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) =>
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			)
			.catch(({ code, message }: FirebaseError) => {
				reject(ErrorGenerator(code, message))
			})
	})
}

// Posts

export const serviceCreatepost = ({
	post,
}: ICreatePost): Promise<PostCreatePost> => {
	return new Promise((resolve, reject) => {
		console.log('serviceCreatepost = post', post)
		db.collection(collections.posts)
			.add(post)
			.then(({ id }) => {
				resolve({
					__typename: 'CreatePost',
					createPost: id,
					success: {
						message: 'Post created successfully',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) =>
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			)
			.catch(({ code, message }: FirebaseError) => {
				reject(ErrorGenerator(code, message))
			})
	})
}

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
	IClapPost,
	PostClapPost,
	GetPostOwnerList,
	PostDeletePost,
} from './post'
import { ErrorGenerator, EErrorCode } from './../../utils/error-utils'
import { db, collections, storage } from './../../firebase/firebase'
import { FirebaseError, firestore } from 'firebase-admin'
import { Post } from '../../entities/post'
import { LIMIT_LIST } from '../../constants'
import R from 'ramda'
import { TypesErrors } from './../../data/enums'

// Get

export const serviceGetPosts = async (
	lastPost: string
): Promise<GetPostList> => {
	const postRef = db.collection(collections.posts)
	let snapShot: any = null
	if (lastPost) {
		snapShot = await postRef.doc(lastPost).get()
	}
	const postPageRef = snapShot
		? postRef
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.medium)
		: postRef.orderBy('createdAt', 'desc').limit(LIMIT_LIST.medium)
	return new Promise((resolve, reject) => {
		postPageRef
			.get()
			.then((posts) => {
				let allPost: Array<Post> = []
				posts.forEach((post) => {
					const data: Post = post.data()
					const item: Post = {
						id: post.id,
						...data,
						createdAt: data.createdAt && data.createdAt.toDate(),
					}
					allPost.push(item)
				})
				resolve({
					__typename: 'GetPosts',
					allPost,
					success: {
						type: R.isEmpty(allPost) ? '' : '',
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

export const serviceGetPostsByOwner = async ({
	lastPost,
	owner,
}: IGetPostOwner): Promise<GetPostOwnerList> => {
	const postRef = db.collection(collections.posts)
	let snapShot: any = null
	if (lastPost) {
		snapShot = await postRef.doc(lastPost).get()
	}
	const postPageRef = snapShot
		? postRef
				.orderBy('createdAt', 'desc')
				.where('owner', '==', owner)
				.startAfter(snapShot)
				.limit(LIMIT_LIST.medium)
		: postRef
				.orderBy('createdAt', 'desc')
				.where('owner', '==', owner)
				.limit(LIMIT_LIST.medium)
	return new Promise((resolve, reject) => {
		postPageRef
			.get()
			.then((posts) => {
				let allPostOwner: Array<Post> = []
				posts.forEach((post) => {
					const data = post.data()
					const item: Post = {
						id: post.id,
						...data,
						createdAt: data.createdAt && data.createdAt.toDate(),
					}
					allPostOwner.push(item)
				})
				resolve({
					__typename: 'GetPostsOwner',
					allPostOwner,
					success: {
						message: R.isEmpty(allPostOwner)
							? 'No posts yet'
							: 'All posts ready',
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
					post: { ...data.data() },
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
	ownerProfile,
	metadata,
}: ICreatePost): Promise<PostCreatePost> => {
	const postRef = db.collection(collections.posts)
	const createdAt = firestore.Timestamp.now()
	return new Promise((resolve, reject) => {
		postRef
			.add({ ...post, ownerProfile, metadata, createdAt })
			.then(({ id }) => {
				resolve({
					__typename: 'CreatePost',
					createPost: {
						id,
						...post,
						createdAt: createdAt.toDate(),
					},
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

export const serviceRemovePost = async (
	id: string
): Promise<PostDeletePost> => {
	const postRef = db.collection(collections.posts).doc(id)
	const data = await postRef.get()
	const postDelete: Post | undefined = data.data()

	if (!data || !postDelete) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: TypesErrors.NOT_FOUND,
				message: `Publicacao nao encontrada com ID: ${id}`,
			},
		}
	}
	// Firestore update (Remove post image)
	if (postDelete.metadata) {
		await storage
			.bucket(postDelete.metadata.fileBucket)
			.file(postDelete.metadata.fileFullPath)
			.delete()
	}
	// End firestore

	return new Promise((resolve, reject) => {
		postRef
			.delete()
			.then((response) => {
				console.log(`Remove post succesfull: `, response)
				resolve({
					__typename: 'RemovePost',
					post: id,
					success: {
						message: `Publicacao removida com sucesso: ID ${id}`,
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

export const serviceClapPost = async ({
	post,
	collection,
	owner,
}: IClapPost): Promise<PostClapPost> => {
	console.log('serviceClapPost: post => ', post)
	console.log('serviceClapPost: collection => ', collection)
	console.log('serviceClapPost: owner => ', owner)
	const postRef = db
		.collection(
			collection === 'COURSE' ? collections.courses : collections.posts
		)
		.doc(post)
	const postData: Post | undefined = await (await postRef.get()).data()
	let claps = [...((postData && postData.claps) || [])]

	const exists = claps.indexOf(owner)
	if (exists < 0 && owner) {
		claps = [...R.union(claps, [owner])]
	} else {
		claps = [...R.remove(exists, 1, claps)]
	}
	return new Promise((resolve, reject) => {
		postRef
			.update({
				claps,
				clapsCount: claps.length,
			})
			.then(() => {
				resolve({
					__typename: 'ClapPost',
					post,
					success: {
						message: `Clap ${collections} succesfull`,
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

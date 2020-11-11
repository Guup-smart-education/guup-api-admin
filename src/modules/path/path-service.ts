import {
	// Gets
	GetPath,
	GetPathList,
	GetPathListOwner,
	// Posts
	PostCreatePath,
	// Inputs
	ICreatePath,
	IGetPathID,
	IGetPathOwner,
	IUpdateStatusPath,
	PostUpdateStatusPath,
} from './path'
import { ErrorGenerator, EErrorCode } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError, firestore } from 'firebase-admin'
import { Path } from '../../entities/path'
import { EPathStatus } from './path-enum'
import { LIMIT_LIST } from '../../constants'

// Gets

export const serviceGetAllPaths = async (
	lastPath: string
): Promise<GetPathList> => {
	const pathRef = db.collection(collections.paths)
	let snapShot: any = null
	if (lastPath) {
		snapShot = await pathRef.doc(lastPath).get()
	}
	const pathPageRef = snapShot
		? pathRef
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.medium)
		: pathRef.orderBy('createdAt', 'desc').limit(LIMIT_LIST.medium)

	return new Promise((resolve, reject) => {
		pathPageRef
			.get()
			.then((paths) => {
				const allPaths: Array<Path> = []
				paths.forEach((path) => {
					const data: Path = path.data()
					const item: Path = {
						id: path.id,
						...data,
						createdAt: data.createdAt && data.createdAt.toDate(),
					}
					allPaths.push(item)
				})
				resolve({
					__typename: 'GetPaths',
					allPaths,
					success: {
						message: 'All paths are ready',
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
				reject(ErrorGenerator(code, message))
			})
	})
}

export const serviceGetPathsOwner = async ({
	lastPath,
	owner,
}: IGetPathOwner): Promise<GetPathListOwner> => {
	const pathRef = db.collection(collections.paths)
	let snapShot: any = null
	if (lastPath) {
		snapShot = await pathRef.doc(lastPath).get()
	}
	const pathPageRef = snapShot
		? pathRef
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.medium)
		: pathRef.orderBy('createdAt', 'desc').limit(LIMIT_LIST.medium)

	return new Promise((resolve, reject) => {
		pathPageRef
			.where('owner', '==', owner)
			.get()
			.then((paths) => {
				const allPathsOwner: Array<Path> = []
				paths.forEach((path) => {
					const item: Path = { id: path.id, ...path.data() }
					allPathsOwner.push(item)
				})
				resolve({
					__typename: 'GetPathsOwner',
					allPathsOwner,
					success: {
						message: 'All paths are ready',
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
				reject(ErrorGenerator(code, message))
			})
	})
}

export const serviceGetPathsID = async ({
	id,
}: IGetPathID): Promise<GetPath> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.paths)
			.doc(id)
			.get()
			.then((data) => {
				const path = { id: data.id, ...data.data() }
				resolve({
					__typename: 'GetPath',
					path,
					success: {
						message: 'All paths are ready',
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
				reject(ErrorGenerator(code, message))
			})
	})
}

// Posts

export const serviceCreatePath = async ({
	path,
	access,
	status,
}: ICreatePath): Promise<PostCreatePath> => {
	return new Promise((resolve, reject) => {
		console.log('serviceCreatePath: ', path)
		const createdAt = firestore.Timestamp.now()
		db.collection(collections.paths)
			.add({
				...path,
				access,
				status: status || EPathStatus.WAITING,
				createdAt,
			})
			.then(({ id }) => {
				resolve({
					__typename: 'CreatePath',
					createPath: id,
					success: {
						message: 'Path created successfully',
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
				console.log('Service catch error')
				reject(ErrorGenerator(code, message))
			})
	})
}

export const serviceUpdateStatusPath = async ({
	path,
	status,
}: IUpdateStatusPath): Promise<PostUpdateStatusPath> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.paths)
			.doc(path)
			.update({
				status,
			})
			.then(() => {
				resolve({
					__typename: 'CreatePath',
					updateStatus: status,
					success: {
						message: 'Path created successfully',
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
				reject(ErrorGenerator(code, message))
			})
	})
}

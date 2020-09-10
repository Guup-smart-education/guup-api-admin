import {
	// Gets
	GetPath,
	GetPathList,
	// Posts
	PostCreatePath,
	// Inputs
	ICreatePath,
	IGetPathID,
	IGetPathOwner,
} from './path'
import { ErrorGenerator, EErrorCode } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError } from 'firebase-admin'
import { Path } from '../../entities/path'
import R from 'ramda'

// Gets

export const serviceGetAllPaths = async (): Promise<GetPathList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.paths)
			.get()
			.then((paths) => {
				const allPaths: Array<Path> = []
				paths.forEach((path) => {
					const item: Path = { id: path.id, ...path.data() }
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
	owner,
}: IGetPathOwner): Promise<GetPathList> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.paths)
			.where('owner', '==', owner)
			.get()
			.then((paths) => {
				const allPaths: Array<Path> = []
				paths.forEach((path) => {
					const item: Path = { id: path.id, ...path.data() }
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
}: ICreatePath): Promise<PostCreatePath> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.paths)
			.add(path)
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
				reject(ErrorGenerator(code, message))
			})
	})
}

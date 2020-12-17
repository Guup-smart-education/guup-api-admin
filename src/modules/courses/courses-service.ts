import R from 'ramda'
import * as dotenv from 'dotenv-flow'
import {
	// Gets
	GetCoursesByUserResponse,
	GetCoursesResponse,
	GetCourseById,
	GetCoursesByPath,
	// Posts
	PostCourseResponse,
	PostUpdateCourseResponse,
	UpdatePathCourses,
	RemoveCourseResponse,
	GetCoursesByOwner,
} from './courses'
import { Courses } from './../../entities/courses'
import { MediaMetaData } from './../../entities/mediaData'
import { Profile } from './../../entities/user'
import { Path } from './../../entities/path'
import { MuxAsset } from './../../entities/mux'
import { TypesErrors, EMediaState } from './../../data/enums'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections, storage } from './../../firebase/firebase'
import { FirebaseError, firestore } from 'firebase-admin'
import { LIMIT_LIST } from '../../constants'
import {
	MuxCreateAsset,
	MuxGetPlaybackID,
	MuxGenerateThumbnail,
	MuxGenerateGif,
	MuxDeleteAsset,
} from '../../service/mux-service'

dotenv.config({
	default_node_env: 'development',
	silent: true,
})

// Get

export const serviceGetCourses = async (
	lastCourse: string
): Promise<GetCoursesResponse> => {
	const courseRef = db.collection(collections.courses)
	let snapShot: any = null
	if (lastCourse) {
		snapShot = await courseRef.doc(lastCourse).get()
	}
	const coursePageRef = snapShot
		? courseRef
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.medium)
		: courseRef.orderBy('createdAt', 'desc').limit(LIMIT_LIST.medium)
	return new Promise((resolve, reject) => {
		coursePageRef
			.get()
			.then((data) => {
				let courses: Array<Courses> = []
				data.forEach((doc) => {
					const dataCourse: Courses = doc.data()
					const course: Courses = {
						id: doc.id,
						...dataCourse,
						createdAt: dataCourse.createdAt.toDate(),
					}
					courses.push(course)
				})
				resolve({
					__typename: 'GetCourses',
					courses,
					success: {
						message: 'All courses ready',
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

export const serviceGetCoursesByUser = async (
	uid: string,
	lastCourse: string
): Promise<GetCoursesByOwner> => {
	const courseRef = db.collection(collections.courses)
	let snapShot: any = null
	if (lastCourse) {
		snapShot = await courseRef.doc(lastCourse).get()
	}
	const coursePageRef = snapShot
		? courseRef
				.where('owner', '==', uid)
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.medium)
		: courseRef
				.where('owner', '==', uid)
				.orderBy('createdAt', 'desc')
				.limit(LIMIT_LIST.medium)
	return new Promise((resolve, reject) => {
		coursePageRef
			.get()
			.then((data) => {
				let coursesByOwner: Array<Courses> = []
				data.forEach((doc) => {
					const course = { id: doc.id, ...doc.data() }
					coursesByOwner.push(course)
				})
				resolve({
					__typename: 'GetCoursesByOwner',
					coursesByOwner,
					success: {
						message: 'All courses by users',
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

export const serviceGetCoursesByPath = async (
	path: string,
	lastCourse?: string
): Promise<GetCoursesByPath> => {
	const courseRef = db.collection(collections.courses)
	let snapShot: any = null
	if (lastCourse) {
		snapShot = await courseRef.doc(lastCourse).get()
	}
	const coursePageRef = snapShot
		? courseRef
				.where('path', '==', path)
				.orderBy('createdAt', 'desc')
				.startAfter(snapShot)
				.limit(LIMIT_LIST.tiny)
		: courseRef
				.where('path', '==', path)
				.orderBy('createdAt', 'desc')
				.limit(LIMIT_LIST.tiny)
	return new Promise((resolve, reject) => {
		coursePageRef
			.get()
			.then((data) => {
				let coursesByPath: Array<Courses> = []
				data.forEach((doc) => {
					const data: Courses = doc.data()
					const course = {
						id: doc.id,
						...data,
						createdAt: data.createdAt && data.createdAt.toDate(),
					}
					coursesByPath.push(course)
				})
				resolve({
					__typename: 'GetCoursesByPath',
					coursesByPath,
					success: {
						message: 'All courses by users',
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

export const serviceGetCourseDetailByUser = (
	course: string,
	uid: string
): Promise<GetCourseById> => {
	return new Promise((response, reject) => {
		if (!course || !uid) {
			response({
				__typename: 'ErrorResponse',
				error: {
					message: `missing data to finish this operation`,
				},
			})
		}
		db.collection(collections.users)
			.doc(uid)
			.collection(collections.courses)
			.doc(course)
			.get()
			.then((data) => {
				const courseData = data.data()
				const course = courseData ? { id: data.id, ...courseData } : {}
				const message = courseData
					? `Course founded successfull`
					: `Course not found with id: ${data.id}`
				response({
					__typename: courseData ? 'GetCourseDetail' : 'ErrorResponse',
					course,
					success: { message },
					error: { message },
				})
			})
			.catch((error) => reject(error))
	})
}

// Post

export const serviceRemoveCourse = async (
	course: string
): Promise<RemoveCourseResponse> => {
	const courseRef = db.collection(collections.courses).doc(course)
	const data = await courseRef.get()
	const courseToDelete: Courses | undefined = data.data()
	if (!data || !courseToDelete) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: TypesErrors.NOT_FOUND,
				message: `Conteudo não encontrado com ID: ${course}`,
			},
		}
	}
	// Mux delete data
	const muxDeleteResponse: any = await MuxDeleteAsset(
		`${courseToDelete.videoAssetId}`
	)
	console.log('muxResponse: ', muxDeleteResponse)

	// TODO: O ue fazer quando de um erro na hora de eliminar um video no MUX?
	// if (muxResponse.error) {
	// 	return {
	// 		__typename: 'ErrorResponse',
	// 		error: {
	// 			type: TypesErrors.ERROR,
	// 			message: `Aconteceu um erro eliminado o mux asset: ${asseetId}`,
	// 		},
	// 	}
	// }
	// End mux delete data
	// Firebase update (Remove media from firestorage)
	if (courseToDelete.videoMetadata && courseToDelete.coverMetadata) {
		const { videoMetadata, coverMetadata } = courseToDelete
		await storage
			.bucket(videoMetadata.fileBucket)
			.file(videoMetadata.fileFullPath)
			.delete()
		await storage
			.bucket(coverMetadata.fileBucket)
			.file(coverMetadata.fileFullPath)
			.delete()
	}
	// End firebase update
	return new Promise((resolve, reject) => {
		courseRef
			.delete()
			.then(() => {
				resolve({
					__typename: 'RemoveCourse',
					removeCourse: course,
					success: {
						message: 'Curso removido com sucesso',
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

export const serviceUpdateCourse = (
	course: Courses
): Promise<PostUpdateCourseResponse> => {
	return new Promise((response, reject) => {
		db.collection(collections.courses)
			.doc(`${course.id}`)
			.update(course)
			.then((data) => {
				response({
					__typename: 'UpdateCourse',
					course: data,
					success: {
						message: 'Course update successfull',
					},
				})
			})
			.catch((error) => reject(error))
	})
}

export const serviceCreateCourse = async (
	course: Courses,
	videoMetadata: MediaMetaData,
	coverMetadata: MediaMetaData
): Promise<PostCourseResponse> => {
	if (!videoMetadata || !coverMetadata) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: TypesErrors.ERROR,
				message: 'Não foram proporcionadas informações insuficientes',
			},
		}
	}
	const [filePublic] = await storage
		.bucket(videoMetadata.fileBucket)
		.file(`${videoMetadata.fileFullPath}`)
		.makePublic()
	const videoURL: string = `${process.env.GCLOUD_STORAGE_ADDRESS}/${filePublic.bucket}/${filePublic.object}`
	// Creating a Video Asset
	const muxCreateAsset: MuxAsset = await MuxCreateAsset(videoURL, 'public')
	const createdAt = firestore.Timestamp.now()
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.add({
				...course,
				createdAt,
				videoMetadata,
				coverMetadata,
				videoURL,
				videoAssetId: muxCreateAsset.id,
				state: EMediaState.preparing,
			})
			.then(({ id }) => {
				resolve({
					__typename: 'CreateCourse',
					createCourse: id,
					success: {
						message: 'Course added successfull',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
	})
}

export const serviceUpdateCourseMedia = async (
	videoAssetId: string,
	state: keyof typeof EMediaState
): Promise<UpdatePathCourses> => {
	const ref = db.collection(collections.courses)
	const data = await ref.where('videoAssetId', '==', videoAssetId).get()
	let course: Courses | undefined
	await data.forEach((doc) => {
		course = { id: doc.id, ...doc.data() }
	})
	console.log('**************')
	console.log('serviceUpdateCourseMedia: course => ', course)
	console.log('**************')
	if (!course) {
		return {
			__typename: 'ErrorResponse',
			error: {
				message: `Não foi encontrado a referencia do video com id ${videoAssetId}`,
			},
		}
	}
	// Getting mux data
	const muxPlayBackId: any = await MuxGetPlaybackID(videoAssetId)
	const videoPlaybackID = `${muxPlayBackId.id}`
	const thumbnailURL = MuxGenerateThumbnail(videoPlaybackID)
	const gifURL = MuxGenerateGif(videoPlaybackID)
	// Updating course
	return new Promise(async (resolve, reject) => {
		ref
			.doc(`${course?.id}`)
			.update({
				videoPlaybackID,
				thumbnailURL,
				gifURL,
				state,
			})
			.then(() => {
				resolve({
					__typename: 'UpdateCourse',
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
	})
}

export const serviceUpdatePathOwners = async (
	pathId: string,
	owner: Profile
): Promise<UpdatePathCourses> => {
	const pathRef = db.collection(collections.paths).doc(pathId)
	const data = await pathRef.get()
	const path: Path | undefined = data ? data.data() : {}
	if (!path) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: TypesErrors.NOT_FOUND,
				message: 'Coleccion of course its not founded',
			},
		}
	}
	const owners = R.union(path.owners || [], [owner])
	const contentCount = path.contentCount ? path.contentCount + 1 : 0
	return new Promise((resolve, reject) => {
		pathRef
			.update({ owners, contentCount })
			.then(() => {
				resolve({
					__typename: 'UpdatePathCourse',
					success: {
						message: 'Added participant to da collection',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
	})
}

export const serviceGetCourseById = async (
	course: string
): Promise<GetCourseById> => {
	const ref = storage
		.bucket('guup-36ad1.appspot.com')
		.file(
			'courses/49V0ly7JwjgcGk78WNEp/7c4b2b4c-b557-4a34-9609-6cedaf7638dd.mp4'
		)
	const [file] = await ref.makePublic()

	// .getSignedUrl({
	// 	action: 'read',
	// 	expires: Date.now() + 1000 * 60 * 10,
	// 	version: 'v4',
	// })
	// .then((res) => {
	// 	console.log('makePublic: ', res)
	// })
	// .catch((e) => console.log('makePublic error: ', e))
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.doc(course)
			.get()
			.then((data) => {
				resolve({
					__typename: 'GetCourseDetail',
					course: { id: data.id, ...data.data() },
					success: {
						message: `Course founded successfully`,
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
	})
}

// **: Example for multiple calls
// export const serviceGetCourseById = async (
// 	course: string
// ): Promise<GetCourseById> => {
// 	const ref = db.collection(collections.courses).doc(course)
// 	const courseRef = await ref.get()
// 	const modulesRef = await ref.collection(collections.modules).get()
// 	const modules: [CourseModules] =
// 		modulesRef.docs.map(
// 			async (doc): Promise<CourseModules> => {
// 				const contentRef = await ref
// 					.collection(collections.modules)
// 					.doc(doc.id)
// 					.collection(collections.content)
// 					.get()
// 				const content =
// 					(contentRef.docs.map(
// 						(content): CourseModuleContent => ({
// 							id: content.id,
// 							...content.data(),
// 						})
// 					) as [CourseModuleContent]) || {}
// 				return { id: doc.id, ...doc.data(), content }
// 			}
// 		) || {}
// 	return {
// 		__typename: 'GetCourseDetail',
// 		course: { ...courseRef.data(), modules },
// 	}
// }

// ** Example for promise all
// export const serviceEnrollCourse = (
// 	course: Courses,
// 	user: User
// ): Promise<PostUpdateCourseEnrollResponse> => {
// 	const updateCourse = new Promise<PostUpdateCourseEnrollResponse>(
// 		(resolve, reject) => {
// 			db.collection(collections.courses)
// 				.doc(`${course.id}`)
// 				.collection(collections.users)
// 				.doc(`${user.uid}`)
// 				.create(user)
// 				.then((data) => {
// 					console.log('data enroll course', data)
// 					resolve({
// 						__typename: 'UpdateCourseUser',
// 						course: course.id,
// 						success: {
// 							message: 'User enrolled successfully',
// 						},
// 					})
// 				})
// 				.catch(({ code, message }: FirebaseError) => {
// 					resolve({
// 						__typename: 'ErrorResponse',
// 						error: { ...ErrorGenerator(code) },
// 					})
// 				})
// 				.catch((error) => reject(error))
// 		}
// 	)
// 	const updateUser = new Promise<PostUpdateCourseEnrollResponse>(
// 		(resolve, reject) => {
// 			db.collection(collections.users)
// 				.doc(`${user.uid}`)
// 				.collection(collections.courses)
// 				.doc(`${course.id}`)
// 				.create(course)
// 				.then((data) => {
// 					console.log('data enroll user', data)
// 					resolve({
// 						__typename: 'UpdateCourseUser',
// 						user: { ...user },
// 						success: {
// 							message: 'User enrolled successfully',
// 						},
// 					})
// 				})
// 				.catch(({ code, message }: FirebaseError) => {
// 					resolve({
// 						__typename: 'ErrorResponse',
// 						error: { ...ErrorGenerator(code) },
// 					})
// 				})
// 		}
// 	)
// 	return Promise.all<PostUpdateCourseEnrollResponse>([
// 		updateCourse,
// 		updateUser,
// 	]).then((data) => {
// 		return { ...R.mergeAll(data) }
// 	})
// }

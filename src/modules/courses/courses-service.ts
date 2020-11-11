import R from 'ramda'
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
import { Profile } from './../../entities/user'
import { Path } from './../../entities/path'
import { TypesErrors } from './../../data/enums'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError, firestore } from 'firebase-admin'
import { LIMIT_LIST } from '../../constants'
import { response } from 'express'

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
					console.log(doc.id, `Doc`, course)
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
	console.log('path: ', path)
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

export const serviceRemoveCourse = (
	course: string
): Promise<RemoveCourseResponse> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.doc(course)
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
	course: Courses
): Promise<PostCourseResponse> => {
	const createdAt = firestore.Timestamp.now()
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.add({ ...course, createdAt })
			.then(({ id }) => {
				console.info('Course data', id)
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
	console.log('path.contentCount: ', path.contentCount)
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

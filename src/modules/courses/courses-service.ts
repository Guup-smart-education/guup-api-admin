import {
	// Gets
	GetCoursesByUserResponse,
	GetCoursesResponse,
	GetCourseById,
	// Posts
	PostCourseResponse,
	PostUpdateCourseResponse,
} from './courses'
import { Courses } from './../../entities/courses'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError } from 'firebase-admin'

// Get

export const serviceGetCourses = (): Promise<GetCoursesResponse> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.get()
			.then((data) => {
				let courses: Array<Courses> = []
				data.forEach((doc) => {
					const course = { id: doc.id, ...doc.data() }
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

export const serviceGetCoursesByUser = (
	uid: string
): Promise<GetCoursesByUserResponse> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.where('owner', '==', uid)
			.get()
			.then((data) => {
				let courses: Array<Courses> = []
				data.forEach((doc) => {
					const course = { id: doc.id, ...doc.data() }
					courses.push(course)
					console.log(doc.id, `Doc`, course)
				})
				console.log(`All Courses by user`, courses)
				resolve({
					__typename: 'GetCourses',
					courses,
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

export const serviceGetCoursesByPath = (
	path: string
): Promise<GetCoursesResponse> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.where('path', '==', path)
			.get()
			.then((data) => {
				let courses: Array<Courses> = []
				data.forEach((doc) => {
					const course = { id: doc.id, ...doc.data() }
					courses.push(course)
				})
				resolve({
					__typename: 'GetCourses',
					courses,
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

export const serviceCreateCourse = (
	course: Courses
): Promise<PostCourseResponse> => {
	console.log('couserviceCreateCourse: Course', course)
	return new Promise((resolve, reject) => {
		db.collection(collections.courses)
			.add({ ...course })
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

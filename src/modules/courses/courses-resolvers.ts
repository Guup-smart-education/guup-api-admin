import R from 'ramda'
import { AuthData } from './../../models/auth'
import { Courses } from './../../entities/courses'
import {
	// Gets
	GetCoursesResponse,
	GetCoursesByUserResponse,
	GetCourseById,
	// Posts
	PostCourseResponse,
	// Inputs
	InputCourse,
	InputCourseId,
	InputUser,
	InputCoursePath,
} from './courses'
import {
	serviceGetCourses,
	serviceGetCoursesByUser,
	serviceCreateCourse,
	serviceGetCourseById,
	serviceGetCoursesByPath,
} from './courses-service'

const postResolvers = {
	Query: {
		getCourses: async (
			obj: any,
			args: any,
			context: any
		): Promise<GetCoursesResponse> => {
			const response = await serviceGetCourses()
			return response
		},
		getCoursesByUser: async (
			obj: any,
			{ uid }: InputUser,
			{ user: { uid: uidToken }, roles }: AuthData
		): Promise<GetCoursesByUserResponse> => {
			const response = await serviceGetCoursesByUser(uid || uidToken || '')
			return response
		},
		getCoursesByPath: async (
			obj: any,
			{ path }: InputCoursePath,
			context: any
		): Promise<GetCoursesByUserResponse> => {
			const response = await serviceGetCoursesByPath(path)
			return response
		},
		getCourseByID: async (
			obj: any,
			{ id }: InputCourseId,
			context: any
		): Promise<GetCourseById> => {
			const response = await serviceGetCourseById(id)
			return response
		},
	},
	Mutation: {
		createCourse: async (
			obj: any,
			{ course }: InputCourse,
			{ user: { uid, displayName, photoURL, experience } }: AuthData
		): Promise<PostCourseResponse> => {
			const response = await serviceCreateCourse({
				...course,
				owner: uid,
				ownerProfile: { displayName, photoURL, experience },
			})
			return response
		},
		// addCourseModule: async (
		// 	obj: any,
		// 	{ course, module }: InputCourseModule,
		// 	{ user: { uid }, roles }: AuthData
		// ): Promise<PostCourseModuleResponse> => {
		// 	const response = await serviceAddCourseModule(course, module)
		// 	return response
		// },
		// addCourseContent: async (
		// 	obj: any,
		// 	{ course, module, content }: InputCourseContent,
		// 	{ user: { uid }, roles }: AuthData
		// ): Promise<PostCourseContentResponse> => {
		// 	const response = await serviceAddCourseContent(course, module, content)
		// 	return response
		// },
		// enrollUserCourse: async (
		// 	obj: any,
		// 	{ course }: InputCourseUser,
		// 	{ user }: AuthData
		// ): Promise<PostUpdateCourseResponse> => {
		// 	// Getting course data
		// 	const responseCourse = await serviceGetCourseById(course)
		// 	if (!responseCourse.error) {
		// 		return responseCourse
		// 	}
		// 	// Updating course
		// 	const responseEnroll = await serviceEnrollCourse(
		// 		responseCourse.course || {},
		// 		user
		// 	)
		// 	return responseEnroll
		// },
		// updateCourse: async (
		// 	obj: any,
		// 	{ course }: InputCourse,
		// 	{ user: { uid = '' }, roles }: AuthData
		// ): Promise<PostUpdateCourseResponse> => {
		// 	const response = await serviceUpdateCourse(course, uid)
		// 	return response
		// },
	},
}

export default postResolvers

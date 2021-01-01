import { AuthData } from './../../models/auth'
import { CoursesTypesNames } from './courses-enum'
import { Courses } from './../../entities/courses'
import {
	// Gets
	GetCoursesResponse,
	GetCourseById,
	GetCoursesByPath,
	GetCoursesByOwner,
	// Posts
	PostCourseResponse,
	UptCourseResponse,
	RemoveCourseResponse,
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
	serviceUpdatePathOwners,
	serviceRemoveCourse,
} from './courses-service'
import { PostDeletePost } from '../post/post'

const postResolvers = {
	URemoveCourse: {
		__resolveType: (obj: RemoveCourseResponse, contex: any, info: any) => {
			if (obj.removeCourse || obj.success) return CoursesTypesNames.RemoveCourse
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	UUpdateCourse: {
		__resolveType: (obj: UptCourseResponse, contex: any, info: any) => {
			if (obj.updateCourse || obj.success) return CoursesTypesNames.UpdateCourse
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	UCreateCourse: {
		__resolveType: (obj: PostCourseResponse, contex: any, info: any) => {
			if (obj.createCourse || obj.success) return CoursesTypesNames.CreateCourse
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	UGetCourses: {
		__resolveType: (obj: GetCoursesResponse, contex: any, info: any) => {
			if (obj.courses || obj.success) return CoursesTypesNames.GetCourses
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	UGetCoursesByPath: {
		__resolveType: (obj: GetCoursesByPath, contex: any, info: any) => {
			if (obj.coursesByPath || obj.success)
				return CoursesTypesNames.GetCoursesByPath
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	UGetCoursesByOwner: {
		__resolveType: (obj: GetCoursesByOwner, contex: any, info: any) => {
			if (obj.coursesByOwner || obj.success)
				return CoursesTypesNames.GetCoursesByOwner
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	UGetCourseDetail: {
		__resolveType: (obj: GetCourseById, contex: any, info: any) => {
			if (obj.course || obj.success) return CoursesTypesNames.GetCourseDetail
			if (obj.error) return CoursesTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		getCourses: async (
			obj: any,
			{ lastCourse }: { lastCourse: string },
			context: any
		): Promise<GetCoursesResponse> => {
			const response = await serviceGetCourses(lastCourse)
			return response
		},
		getCoursesByUser: async (
			obj: any,
			{ uid, lastCourse }: InputUser,
			{ user: { uid: uidToken }, roles }: AuthData
		): Promise<GetCoursesByOwner> => {
			const response = await serviceGetCoursesByUser(
				uid || uidToken || '',
				lastCourse
			)
			return response
		},
		getCoursesByPath: async (
			obj: any,
			{ path, lastCourse }: InputCoursePath,
			context: any
		): Promise<GetCoursesByPath> => {
			const response = await serviceGetCoursesByPath(path, lastCourse)
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
			{ course, videoMetadata, coverMetadata, ownerProfile }: InputCourse,
			{ user: { uid, profile } }: AuthData
		): Promise<PostCourseResponse> => {
			console.log('ownerProfile: ', ownerProfile)
			const response = await serviceCreateCourse(
				{
					...course,
					owner: uid,
					ownerProfile: ownerProfile || { ...profile },
				},
				videoMetadata,
				coverMetadata
			)
			// if (response.__typename === 'CreateCourse' && course.path) {
			// 	await serviceUpdatePathOwners(course.path, { uid, ...args })
			// }
			return response
		},
		removeCourse: async (
			obj: any,
			{ course }: any,
			{ user: { uid, ...args } }: AuthData
		): Promise<RemoveCourseResponse> => {
			return serviceRemoveCourse(course)
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

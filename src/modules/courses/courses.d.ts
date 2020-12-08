import {
	Courses,
	CourseModules,
	CourseModuleContent,
	MediaMetaData,
} from './../../entities/courses'
import { User } from './../../entities/user'
import { error } from './../../models/error'
import { success } from './../../models/success'
import { CoursesTypesNames } from './courses-enum'

interface TypeName {
	__typename: keyof typeof CoursesTypesNames
}

// Gets
export interface AllCourses extends TypeName, success, error {
	courses?: Array<Courses>
}

export interface GetCoursesByPath extends TypeName, success, error {
	coursesByPath?: Array<Courses>
}

export interface GetCoursesByOwner extends TypeName, success, error {
	coursesByOwner?: Array<Courses>
}

export interface GetCoursesResponse extends success, error, AllCourses {}

export interface GetCoursesByUserResponse extends success, error, AllCourses {}

export interface GetCourseById extends TypeName, success, error {
	course?: Courses
}

// Posts
export interface UpdatePathCourses extends TypeName, success, error {}

export interface PostCourseResponse extends TypeName, success, error {
	createCourse?: any
}

export interface UptCourseResponse extends TypeName, success, error {
	updateCourse?: any
}

export interface RemoveCourseResponse extends TypeName, success, error {
	removeCourse?: any
}

export interface PostCourseModuleResponse extends TypeName, success, error {
	module: any
}

export interface PostCourseContentResponse extends TypeName, success, error {
	content: any
}

export interface PostUpdateCourseResponse extends TypeName, success, error {
	course?: any
}

export interface PostUpdateCourseResponse extends TypeName, success, error {
	course?: any
}

export interface PostUpdateCourseEnrollResponse
	extends TypeName,
		success,
		error {
	course?: string
	user?: User
}

// Inputs
export interface InputOwner {
	owner: string
}

export interface InputUser {
	uid: string
	lastCourse: string
}

export interface InputCourse {
	course: Courses
	metadata: MediaMetaData
}

export interface InputCourseId {
	id: string
}

export interface InputCoursePath {
	path: string
	lastCourse?: string
}

export interface InputCourseUser {
	course: string
	user: User
}

export interface InputCourseModule {
	course: string
	module: CourseModules
}

export interface InputCourseContent {
	course: string
	module: string
	content: CourseModuleContent
}

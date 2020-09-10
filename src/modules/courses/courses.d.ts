import {
	Courses,
	CourseModules,
	CourseModuleContent,
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

export interface GetCoursesResponse extends success, error, AllCourses {}

export interface GetCoursesByUserResponse extends success, error, AllCourses {}

export interface GetCourseById extends TypeName, success, error {
	course?: Courses
}

// Posts
export interface PostCourseResponse extends TypeName, success, error {
	createCourse?: any
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
}

export interface InputCourse {
	course: Courses
}

export interface InputCourseId {
	id: string
}

export interface InputCoursePath {
	path: string
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

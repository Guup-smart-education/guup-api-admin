import { Comment } from './comment'
import { Profile } from './user'
// export interface CommonCourseData {
// 	id?: string
// 	title?: string
// 	description?: string
// 	type?: string
// }
// export interface CourseModuleContent extends CommonCourseData {}
// export interface CourseRatingComments extends CommonCourseData {}
// export interface CourseProjects extends CommonCourseData {
// 	contentHours: Number
// }
// export interface CourseModules extends CommonCourseData {
// 	progress?: Number
// 	numberProjects?: Number
// 	numberContent?: Number
// 	contentHours?: Number
// 	content?: [CourseModuleContent]
// 	projects?: [CourseProjects]
// }
// export interface CourseAchievements extends CommonCourseData {}
// export interface CoursePrerequisites extends CommonCourseData {}
// export interface CourseGains extends CommonCourseData {}

export interface Courses extends CommonCourseData {
	// subtitle?: string
	// area?: string
	// duration?: Number
	// owner?: string
	// ownerName?: string
	// ownerRole?: string
	// ratingValue?: Number
	// enrolledUsers?: [CourseUser]
	// ratingComments?: [CourseRatingComments]
	// modules?: [CourseModules]
	// achievements?: [CourseAchievements]
	// prerequisites?: [CoursePrerequisites]
	// gains?: [CourseGains]
	id?: string
	path?: string
	owner?: string
	title?: string
	description?: string
	photoURL?: string
	videoURL?: string
	area?: string
	typeContent?: string
	difficult?: string
	viewsCount?: Number
	clapsCount?: Number
	claps?: [string]
	commentsCount?: Number
	comments?: [Comment]
	ownerProfile?: Profile
	createdAt?: any
}

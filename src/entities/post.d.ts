import { success } from './../models/success'
import { Comment } from './comment'
import { Profile } from './user'

export interface Post extends success {
	id?: string
	owner?: string
	title?: string
	description?: string
	photoURL?: string
	linkURL?: string
	viewsCount?: number
	commentsCount?: number
	clapsCount?: number
	claps?: [string]
	comments?: [Comment]
	ownerProfile?: Profile
	createdAt?: any
}

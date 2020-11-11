import { Comment } from './comment'
import { Profile } from './user'

export interface Content {
	id?: string
	collection?: string
	path?: string
	owner?: string
	title?: string
	description?: string
	photoURL?: string
	videoURL?: string
	area?: [string]
	typeContent?: string
	viewsCount?: number
	clapsCount?: number
	claps?: [string]
	commentsCount?: number
	comments?: [Comment]
	ownerProfile?: Profile
	owners?: [Profile]
	access?: string
	status?: string
	contentCount?: number
	createdAt?: any
}

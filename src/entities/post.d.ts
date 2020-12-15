import { success } from './../models/success'
import { Comment } from './comment'
import { Profile } from './user'
import { MediaMetaData } from './mediaData'
export interface Post extends success {
	readonly id?: string
	readonly owner?: string
	readonly title?: string
	readonly description?: string
	readonly photoURL?: string
	readonly linkURL?: string
	readonly viewsCount?: number
	readonly commentsCount?: number
	readonly clapsCount?: number
	readonly claps?: [string]
	readonly comments?: [Comment]
	readonly ownerProfile?: Profile
	readonly createdAt?: any
	readonly metadata?: MediaMetaData
}

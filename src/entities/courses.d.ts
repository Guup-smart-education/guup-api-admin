import { Comment } from './comment'
import { Profile } from './user'
import { MediaMetaData } from './mediaData'

export interface Courses extends CommonCourseData {
	readonly id?: string
	readonly path?: string
	readonly owner?: string
	readonly title?: string
	readonly description?: string
	readonly photoURL?: string
	readonly videoURL?: string
	readonly thumbnailURL?: string
	readonly gifURL?: string
	readonly videoAssetId?: string
	readonly videoPlaybackID?: string
	readonly area?: string
	readonly typeContent?: string
	readonly difficult?: string
	readonly viewsCount?: Number
	readonly clapsCount?: Number
	readonly claps?: [string]
	readonly commentsCount?: Number
	readonly comments?: [Comment]
	readonly ownerProfile?: Profile
	readonly createdAt?: any
	readonly state?: string
	readonly videoMetadata?: MediaMetaData
	readonly coverMetadata?: MediaMetaData
}

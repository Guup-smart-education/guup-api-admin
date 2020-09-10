import { ECommentTypesNames } from './comment-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Comment } from './../../entities/comment'

enum CollectionComment {
	'COURSE' = 'COURSE',
	'POST' = 'POST',
}

interface TypeName {
	__typename: keyof typeof ECommentTypesNames
}

// Gets
export interface GetCommentList extends TypeName, success, error {
	comments?: Array<Comment> | []
}

// Posts
export interface PostCreateComment extends TypeName, success, error {
	comment?: string
}

// Inputs
export interface IGetCommentCourse {
	course: string
}

export interface IPostComment {
	collection: keyof typeof CollectionComment
	comment: Comment
}

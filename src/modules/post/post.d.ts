import { EPostTypesNames } from './post-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Post } from './../../entities/post'

interface TypeName {
	__typename: keyof typeof EPostTypesNames
}

// Gets
export interface GetPostList extends TypeName, success, error {
	allPost?: Array<Post> | []
}

export interface GetPost extends TypeName, success, error {
	post?: Post
}

// Posts
export interface PostCreatePost extends TypeName, success, error {
	createPost?: string
}

// Inputs
export interface IGetPostOwner {
	owner?: string
}

export interface IGetPostID {
	id: string
}

export interface ICreatePost {
	post: Post
}

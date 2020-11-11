import { EPostTypesNames, CollectionClap } from './post-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Post } from './../../entities/post'
import { Profile } from './../../entities/user'

interface TypeName {
	__typename: keyof typeof EPostTypesNames
}

// Gets
export interface GetPostList extends TypeName, success, error {
	allPost?: Array<Post> | []
}

export interface GetPostOwnerList extends TypeName, success, error {
	allPostOwner?: Array<Post> | []
}

export interface GetPost extends TypeName, success, error {
	post?: Post
}

// Posts
export interface PostCreatePost extends TypeName, success, error {
	createPost?: Post
}

export interface PostClapPost extends TypeName, success, error {
	post?: string
}

// Inputs
export interface IGetPostOwner {
	lastPost?: string
	owner?: string
}

export interface IGetPostID {
	id: string
}

export interface ICreatePost {
	post: Post
}

export interface IClapPost {
	collection: keyof typeof CollectionClap
	post: string
	owner: string
}

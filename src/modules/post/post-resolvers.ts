import { AuthData } from './../../models/auth'
import {
	// Get
	GetPost,
	GetPostList,
	// Post
	PostCreatePost,
	// Inputs
	IGetPostOwner,
	ICreatePost,
	IGetPostID,
} from './post'
import {
	serviceGetPosts,
	serviceGetPostsByOwner,
	serviceGetPostsByID,
	serviceCreatepost,
} from './post-service'

const resolvers = {
	Query: {
		getAllPosts: async (
			obj: any,
			data: any,
			context: any
		): Promise<GetPostList> => {
			return await serviceGetPosts()
		},
		getPostsByOwner: async (
			obj: any,
			{ owner }: IGetPostOwner,
			{ user: { uid } }: AuthData
		): Promise<GetPostList> => {
			return await serviceGetPostsByOwner({ owner: owner || uid })
		},
		getPostsById: async (
			obj: any,
			{ id }: IGetPostID,
			context: any
		): Promise<GetPost> => {
			return await serviceGetPostsByID({ id })
		},
	},
	Mutation: {
		createPost: async (
			obj: any,
			{ post }: ICreatePost,
			{ user: { uid, ...args } }: AuthData
		): Promise<PostCreatePost> => {
			return await serviceCreatepost({
				post: { ...post, owner: uid, ownerProfile: { ...args } },
			})
		},
	},
}

export default resolvers

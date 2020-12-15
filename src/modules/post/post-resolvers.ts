import { GetPathList } from '../path/path'
import { AuthData } from './../../models/auth'
import { EPostTypesNames, CollectionClap } from './post-enum'
import {
	// Get
	GetPost,
	GetPostList,
	GetPostOwnerList,
	// Post
	PostCreatePost,
	PostDeletePost,
	PostClapPost,
	// Inputs
	IGetPostOwner,
	ICreatePost,
	IGetPostID,
	IClapPost,
} from './post'
import {
	serviceGetPosts,
	serviceGetPostsByOwner,
	serviceGetPostsByID,
	serviceCreatepost,
	serviceRemovePost,
	serviceClapPost,
} from './post-service'

const resolvers = {
	UGetAllPost: {
		__resolveType: (obj: GetPostList, contex: any, info: any) => {
			if (obj.allPost) return EPostTypesNames.GetPosts
			if (obj.error) return EPostTypesNames.ErrorResponse
			return null
		},
	},
	UGetPostsByOwner: {
		__resolveType: (obj: GetPostOwnerList, contex: any, info: any) => {
			if (obj.allPostOwner) return EPostTypesNames.GetPostsOwner
			if (obj.error) return EPostTypesNames.ErrorResponse
			return null
		},
	},
	UGetPost: {
		__resolveType: (obj: GetPost, contex: any, info: any) => {
			if (obj.post) return EPostTypesNames.GetPost
			if (obj.error) return EPostTypesNames.ErrorResponse
			return null
		},
	},
	UCreatePost: {
		__resolveType: (obj: PostCreatePost, contex: any, info: any) => {
			if (obj.createPost) return EPostTypesNames.CreatePost
			if (obj.error) return EPostTypesNames.ErrorResponse
			return null
		},
	},
	URemovePost: {
		__resolveType: (obj: PostDeletePost, contex: any, info: any) => {
			if (obj.post || obj.success) return EPostTypesNames.RemovePost
			if (obj.error) return EPostTypesNames.ErrorResponse
			return null
		},
	},
	UClapPost: {
		__resolveType: (obj: PostClapPost, contex: any, info: any) => {
			if (obj.post) return EPostTypesNames.ClapPost
			if (obj.error) return EPostTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		getAllPosts: async (
			obj: any,
			{ lastPost }: any,
			context: any
		): Promise<GetPostList> => {
			return await serviceGetPosts(lastPost)
		},
		getPostsByOwner: async (
			obj: any,
			{ lastPost, owner }: IGetPostOwner,
			{ user: { uid } }: AuthData
		): Promise<GetPostOwnerList> => {
			return await serviceGetPostsByOwner({ lastPost, owner: owner || uid })
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
			{ post, ownerProfile, metadata }: ICreatePost,
			{ user: { uid, profile } }: AuthData
		): Promise<PostCreatePost> => {
			return await serviceCreatepost({
				post: {
					...post,
					owner: uid,
				},
				metadata,
				ownerProfile: ownerProfile || profile,
			})
		},
		removePost: async (
			obj: any,
			{ post }: any,
			context: any
		): Promise<PostDeletePost> => {
			return await serviceRemovePost(post)
		},
		clapPost: async (
			obj: any,
			params: IClapPost,
			{ user: { uid } }: AuthData
		): Promise<PostClapPost> => {
			return await serviceClapPost({ ...params, owner: uid || '' })
		},
	},
}

export default resolvers

import { AuthData } from './../../models/auth'
import { EPathTypesNames } from './path-enum'
import {
	// Gets
	GetPath,
	GetPathList,
	GetPathListOwner,
	// Posts
	PostCreatePath,
	PostUpdateStatusPath,
	// Inputs
	ICreatePath,
	IGetPathID,
	IGetPathOwner,
	IUpdateStatusPath,
} from './path'
import {
	serviceGetAllPaths,
	serviceGetPathsID,
	serviceGetPathsOwner,
	serviceCreatePath,
	serviceUpdateStatusPath,
} from './path-service'

const resolvers = {
	UGetAllPaths: {
		__resolveType: (obj: GetPathList, contex: any, info: any) => {
			if (obj.allPaths) return EPathTypesNames.GetPaths
			if (obj.error) return EPathTypesNames.ErrorResponse
			return null
		},
	},
	UGetPathsOwner: {
		__resolveType: (obj: GetPathListOwner, contex: any, info: any) => {
			if (obj.allPathsOwner) return EPathTypesNames.GetPathsOwner
			if (obj.error) return EPathTypesNames.ErrorResponse
			return null
		},
	},
	UGetPath: {
		__resolveType: (obj: GetPath, contex: any, info: any) => {
			if (obj.path) return EPathTypesNames.GetPath
			if (obj.error) return EPathTypesNames.ErrorResponse
			return null
		},
	},
	UCreatePath: {
		__resolveType: (obj: PostCreatePath, contex: any, info: any) => {
			if (obj.createPath) return EPathTypesNames.CreatePath
			if (obj.error) return EPathTypesNames.ErrorResponse
			return null
		},
	},
	UUpdatedStatusPath: {
		__resolveType: (obj: PostUpdateStatusPath, contex: any, info: any) => {
			if (obj.updateStatus) return EPathTypesNames.UpdatedStatusPath
			if (obj.error) return EPathTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		getAllPaths: async (
			obj: any,
			{ lastPath }: any,
			context: any
		): Promise<GetPathList> => {
			return await serviceGetAllPaths(lastPath)
		},
		getPathsByOwner: async (
			obj: any,
			{ owner, lastPath }: IGetPathOwner,
			{ user: { uid } }: AuthData
		): Promise<GetPathListOwner> => {
			return await serviceGetPathsOwner({ owner: owner || uid, lastPath })
		},
		getPathById: async (
			obj: any,
			{ id }: IGetPathID,
			context: any
		): Promise<GetPath> => {
			return await serviceGetPathsID({ id })
		},
	},
	Mutation: {
		createPath: async (
			obj: any,
			{ path, access, status }: ICreatePath,
			{ user: { uid, ...args } }: AuthData
		): Promise<PostCreatePath> => {
			return await serviceCreatePath({
				path: {
					...path,
					owner: uid,
					ownerProfile: {
						uid,
						...args,
					},
				},
				access,
				status,
			})
		},
		updateStatusPath: async (
			obj: any,
			{ path, status }: IUpdateStatusPath,
			context: any
		): Promise<PostUpdateStatusPath> => {
			return await serviceUpdateStatusPath({
				path,
				status,
			})
		},
	},
}

export default resolvers

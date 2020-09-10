import { AuthData } from './../../models/auth'
import {
	// Gets
	GetPath,
	GetPathList,
	// Posts
	PostCreatePath,
	// Inputs
	ICreatePath,
	IGetPathID,
	IGetPathOwner,
} from './path'
import {
	serviceGetAllPaths,
	serviceGetPathsID,
	serviceGetPathsOwner,
	serviceCreatePath,
} from './path-service'

const resolvers = {
	Query: {
		getAllPaths: async (): Promise<GetPathList> => {
			return await serviceGetAllPaths()
		},
		getPathsByOwner: async (
			obj: any,
			{ owner }: IGetPathOwner,
			{ user: { uid } }: AuthData
		): Promise<GetPathList> => {
			return await serviceGetPathsOwner({ owner: owner || uid })
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
			{ path }: ICreatePath,
			{ user: { uid } }: AuthData
		): Promise<PostCreatePath> => {
			return await serviceCreatePath({ path: { ...path, owner: uid } })
		},
	},
}

export default resolvers

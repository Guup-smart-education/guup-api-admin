import { CollectionType, EContentTypesNames } from './content-enum'
import { GetAllContent, ICreateContent, PostContent } from './content'
import { PostCreateContent, GetAllContents } from './content-service'

const resolvers = {
	UGetAllContents: {
		__resolveType: (obj: GetAllContent, contex: any, info: any) => {
			if (obj.allContents) return EContentTypesNames.GetContents
			if (obj.error) return EContentTypesNames.ErrorResponse
			return null
		},
	},
	UCreateContent: {
		__resolveType: (obj: PostContent, contex: any, info: any) => {
			if (obj.contentCreated) return EContentTypesNames.CreateContent
			if (obj.error) return EContentTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		getAllContent: async (
			obj: any,
			{ lastContent }: any,
			context: any
		): Promise<GetAllContent> => {
			return await GetAllContents(lastContent)
		},
	},
	Mutation: {
		createContent: async (
			obj: any,
			{ collection, content }: ICreateContent,
			context: any
		): Promise<PostContent> => {
			return await PostCreateContent(collection, content)
		},
	},
}

export default resolvers

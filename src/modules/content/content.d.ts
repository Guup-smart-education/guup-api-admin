import { EContentTypesNames, CollectionType } from './content-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Content } from './../../entities/content'

interface TypeName {
	__typename: keyof typeof EContentTypesNames
}

// Gets
export interface GetAllContent extends TypeName, success, error {
	allContents?: Array<Content> | []
}

// Posts
export interface PostContent extends TypeName, success, error {
	contentCreated: string
}

// Inputs
export interface ICreateContent {
	collection: keyof typeof CollectionType
	content: Content
}

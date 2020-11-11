import { GetAllContent, PostContent, ICreateContent } from './content'
import { CollectionType } from './content-enum'
import { ErrorGenerator, EErrorCode } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError, firestore } from 'firebase-admin'
import { Content } from '../../entities/content'
import { LIMIT_LIST } from '../../constants'

// Gets
export const GetAllContents = async (
	lastContent: string
): Promise<GetAllContent> => {
	return new Promise((resolve, reject) => {
		resolve({
			__typename: 'GetContents',
			allContents: [],
			success: {
				message: 'Conteudos retornados com sucesso',
			},
		})
	})
}

// Posts
export const PostCreateContent = async (
	collection: keyof typeof CollectionType,
	content: Content
): Promise<PostContent> => {
	return new Promise((resolve, reject) => {
		resolve({
			__typename: 'CreateContent',
			contentCreated: '',
			success: {
				message: 'Conteudo criado com sucesso',
			},
		})
	})
}

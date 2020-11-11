import { success } from './../models/success'
import { Profile } from './user'

export interface Path extends success {
	id?: string
	owner?: string
	title?: string
	description?: string
	photoURL?: string
	views?: number
	comments?: number
	claps?: number
	disabled?: Boolean
	ownerProfile?: Profile
	owners?: [Profile] | []
	areas?: [string] | []
	access?: string
	status?: string
	contentCount?: number
	createdAt?: any
}

import { Profile } from './user'

export interface Comment {
	id?: string
	post?: string
	owner?: string
	description?: string
	ownerProfile?: Profile
	createdAt?: any
}

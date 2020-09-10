import { Profile } from './user'

export interface Review {
	id?: string
	post?: string
	owner?: string
	commentary?: string
	starts?: Number
	ownerProfile?: Profile
}

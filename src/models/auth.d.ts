import { Profile } from './../entities/user'

export interface AuthData {
	user: Profile
	roles: string
}

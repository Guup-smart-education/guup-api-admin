import { User } from './../entities/user'

export interface AuthData {
	user: User
	roles: string
}

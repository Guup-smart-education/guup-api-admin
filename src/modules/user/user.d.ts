import { User } from './../../entities/user'
import { error } from './../../models/error'
import { success } from './../../models/success'
import { EUserTypesNames } from './user-enum'

// Gets
export interface GetUserResponse extends success, error {
	__typename: keyof typeof EUserTypesNames
	user?: any
}

export interface GetAllUsersResponse extends success, error {
	__typename: keyof typeof EUserTypesNames
	allUsers?: any
}

// Posts
export interface CreateUserResponse extends success, error {
	__typename: keyof typeof EUserTypesNames
	createuser?: any
}

export interface UpdateProfileResponse extends success, error {
	__typename: keyof typeof EUserTypesNames
	updateprofile?: any
}

// Inputs
export interface InputGetUser extends success, error {
	__typename: keyof typeof EUserTypesNames
	uid: string
}

export interface InputUser {
	user: User
}

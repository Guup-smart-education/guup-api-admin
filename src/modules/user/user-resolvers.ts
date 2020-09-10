import { AuthData } from './../../models/auth'
import { User } from './../../entities/user'
import {
	GetUserResponse,
	GetAllUsersResponse,
	CreateUserResponse,
	UpdateProfileResponse,
	// Inputs
	InputUser,
	InputGetUser,
} from './user'
import {
	serviceGetAuthUsers,
	serviceGetAllUsers,
	serviceGetUser,
	serviceCreateUser,
	serviceUpdateProfile,
} from './user-service'

const userResolver = {
	Query: {
		getUser: async (
			obj: any,
			{ uid }: InputGetUser,
			{ user: { uid: uidUser }, roles }: AuthData
		): Promise<GetUserResponse> => {
			console.log('getUser uid: ', uid)
			const response = await serviceGetUser(uid || uidUser || '')
			return response
		},
		getAuthUsers: async (
			obj: any,
			args: any,
			{ user, roles }: AuthData
		): Promise<GetAllUsersResponse> => {
			const response = await serviceGetAuthUsers()
			return response
		},
		getAllUsers: async (
			obj: any,
			args: any,
			{ user, roles }: AuthData
		): Promise<GetAllUsersResponse> => {
			const response = await serviceGetAllUsers()
			return response
		},
	},
	Mutation: {
		createUser: async (
			obj: any,
			{ user }: InputUser,
			{ user: userAuth, roles }: AuthData
		): Promise<CreateUserResponse> => {
			const response = await serviceCreateUser(user)
			return response
		},
		updateUserProfile: async (
			obj: any,
			{ user }: InputUser,
			{ user: { uid = '' }, roles }: AuthData
		): Promise<UpdateProfileResponse> => {
			const response = await serviceUpdateProfile(uid, user)
			return response
		},
	},
}

export default userResolver

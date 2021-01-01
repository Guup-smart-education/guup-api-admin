import { AuthData } from './../../models/auth'
import { EUserTypesNames } from './user-enum'
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
	UGetUser: {
		__resolveType: (obj: GetUserResponse, contex: any, info: any) => {
			if (obj.user || obj.success) return EUserTypesNames.GetUser
			if (obj.error) return EUserTypesNames.ErrorResponse
			return null
		},
	},
	UGetAllUsers: {
		__resolveType: (obj: GetAllUsersResponse, contex: any, info: any) => {
			if (obj.allUsers || obj.success) return EUserTypesNames.GetAllUsers
			if (obj.error) return EUserTypesNames.ErrorResponse
			return null
		},
	},
	UUpdateProfile: {
		__resolveType: (obj: UpdateProfileResponse, contex: any, info: any) => {
			if (obj.updateprofile || obj.success) return EUserTypesNames.UpdateProfile
			if (obj.error) return EUserTypesNames.ErrorResponse
			return null
		},
	},
	UCreateUser: {
		__resolveType: (obj: CreateUserResponse, contex: any, info: any) => {
			if (obj.createuser || obj.success) return EUserTypesNames.CreateUser
			if (obj.error) return EUserTypesNames.ErrorResponse
			return null
		},
	},
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
			{ user: inputUser }: InputUser,
			{ user, roles }: AuthData
		): Promise<UpdateProfileResponse> => {
			console.log('updateUserProfile: userAuth = ', user)
			console.log('updateUserProfile: inputUser = ', inputUser)
			if (!user) {
				return {
					__typename: 'ErrorResponse',
					error: {
						message: 'Não foi encontrado um usuario na sessão',
					},
				}
			}
			const response = await serviceUpdateProfile(`${user.uid}`, inputUser)
			return response
		},
	},
}

export default userResolver

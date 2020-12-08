import { ESiginTypesNames } from './auth-enum'
import {
	SigninResponse,
	RequestAccessResponse,
	SignupResponse,
	ExtendSignupResponse,
	// Inputs
	InputRequestAccess,
	InputSigin,
	InputSignup,
} from './auth'
import {
	serviceRequestAccess,
	serviceAuthSignin,
	serviceAuthSignup,
	serviceOnCreateAuth,
} from './auth-service'

const userResolver = {
	// URequestAccess: {
	// 	__resolveType: (obj: RequestAccessResponse, contex: any, info: any) => {
	// 		if (obj.access || obj.expireIn || obj.user)
	// 			return ESiginTypesNames.RequestAccess
	// 		if (obj.error) return ESiginTypesNames.ErrorResponse
	// 		return null
	// 	},
	// },
	// USignInResult: {
	// 	__resolveType: (obj: SigninResponse, contex: any, info: any) => {
	// 		if (obj.user || obj.access) return ESiginTypesNames.SigInSuccess
	// 		if (obj.error) return ESiginTypesNames.ErrorResponse
	// 		return null
	// 	},
	// },
	// USignUp: {
	// 	__resolveType: (obj: SignupResponse, contex: any, info: any) => {
	// 		if (obj.user) return ESiginTypesNames.SignUpSuccess
	// 		if (obj.error) return ESiginTypesNames.ErrorResponse
	// 		return null
	// 	},
	// },
	Mutation: {
		authRequestAccess: async (
			obj: any,
			data: InputRequestAccess,
			context: any
		): Promise<RequestAccessResponse> => {
			const response = await serviceRequestAccess(data)
			return response
		},
		authSignIn: async (
			obj: any,
			data: InputSigin,
			context: any
		): Promise<SigninResponse> => {
			const response = await serviceAuthSignin(data)
			return response
		},
		authSignUp: async (
			obj: any,
			user: InputSignup,
			context: any
		): Promise<ExtendSignupResponse> => {
			const response = await serviceAuthSignup(user)
			// if (error) {
			// 	console.log('serviceOnCreateAuth message:', args)
			// 	return { ...args, error }
			// }
			// const response = await serviceOnCreateAuth(uid || '', user)
			return response
		},
	},
}

export default userResolver

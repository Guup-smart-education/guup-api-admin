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
import { o } from 'ramda'

const userResolver = {
	URequestAccess: {
		__resolveType: (obj: RequestAccessResponse, contex: any, info: any) => {
			if (obj.access || obj.expireIn || obj.user || obj.success)
				return ESiginTypesNames.RequestAccess
			if (obj.error) return ESiginTypesNames.ErrorResponse
			return null
		},
	},
	USignInResult: {
		__resolveType: (obj: SigninResponse, contex: any, info: any) => {
			if (obj.user || obj.access || obj.success)
				return ESiginTypesNames.SigInSuccess
			if (obj.error) return ESiginTypesNames.ErrorResponse
			return null
		},
	},
	USignUp: {
		__resolveType: (obj: SignupResponse, contex: any, info: any) => {
			if (obj.user || obj.success) return ESiginTypesNames.SignUpSuccess
			if (obj.error) return ESiginTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		authQuery: (obj: any, data: InputRequestAccess, context: any) => {
			console.log('Data authQuery: ', data)
			return data
		},
	},
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
			return response
		},
	},
}

export default userResolver

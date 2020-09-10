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

import { error } from './../../models/error'
import { success } from './../../models/success'
import { User } from './../../entities/user'
import { ESiginTypesNames } from './auth-enum'

interface typename {
	__typename: keyof typeof ESiginTypesNames
}

export interface Verificationdata {
	id?: string
	email?: string
	encript?: string
	token?: number
}

export interface JwtAuthBody {
	token: string
	refreshToken: string
}

export interface InputSignup {
	user: {
		email: !string
		password: !string
		phoneNumber: !string
		displayName: string
		role: !EnumUserRole
	}
}

// Request
export interface InputRequestAccess {
	email: string
}

export interface InputSigin {
	email: string
	tokenAccess: number
	// user?: string
	// email?: string
	// password?: string
	// roles?: string
}

// Response

export interface RequestAccessResponse extends typename, success, error {
	expireIn?: Number
	access?: JwtAuthBody
	user?: any
}

export interface SigninResponse extends typename, success, error {
	access?: JwtAuthBody
	user?: any
}

export interface SignupResponse extends typename, success, error {
	access?: JwtAuthBody
	user?: any
}

export interface ExtendSignupResponse extends typename, success, error {
	extendedSignup?: any
}

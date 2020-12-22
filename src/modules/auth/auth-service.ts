import R from 'ramda'
import {
	Verificationdata,
	SigninResponse,
	SignupResponse,
	ExtendSignupResponse,
	RequestAccessResponse,
	InputSignup,
	InputSigin,
	InputRequestAccess,
} from './auth'
import { firebase, db, collections } from './../../firebase/firebase'
import {
	jwtGenerateToken,
	createAccessToken,
	verifyAccessToken,
	decodeAccessToken,
} from './../../utils/auth-utils'
import { sendGuupEmail } from './../../utils/smtp-utils'
import { ErrorGenerator, EErrorCode } from './../../utils/error-utils'
import { FirebaseError } from 'firebase-admin'
import accessTokenTemplate from './../../templates/accessToken'
import { User, Profile } from './../../entities/user'
import { random } from '../../helper'

enum TypesSignInUsers {
	'NEW_USERS' = 'NEW_USERS',
	'OLD_USERS' = 'OLD_USERS',
}

export const serviceRequestAccess = async ({
	email,
}: InputRequestAccess): Promise<RequestAccessResponse> => {
	console.log('serviceRequestAccess')
	const companyRef = db.collection(collections.company)
	const verificationRef = db.collection(collections.verification)
	// Remove old tokens
	const oldTokens = await verificationRef.where('email', '==', email).get()
	if (oldTokens.size) {
		let id = ''
		oldTokens.forEach((old) => (id = old.id))
		await verificationRef.doc(id).delete()
	}
	// Share client by domain
	const userDomain = R.last(R.split('@', email))
	const client = await companyRef.where('domain', '==', userDomain).get()
	if (!client.size) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: EErrorCode.NOT_FOUND,
				message: `Não cocheço a empresa ${userDomain}, verifica se todo esta correto 😅`,
			},
		}
	}
	const verificationData: Verificationdata = {
		email,
		token: random(1000, 9999, false),
	}
	const accessToken = await createAccessToken(verificationData)
	const verify = await verificationRef.add({
		...verificationData,
		encript: accessToken,
	})
	if (!verify.id) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: EErrorCode.ERROR,
				message:
					'Aconteceu um problema, se o erro persiste entre em contato com a gente',
			},
		}
	}
	const emailResponse = await sendGuupEmail({
		to: email,
		subject: 'Access verification',
		html: R.replace(
			'@token',
			verificationData.token?.toString() || ''
		)(accessTokenTemplate),
	})
	console.log('createAccessToken = accessToken', accessToken)
	console.log('createAccessToken = emailResponse', emailResponse)
	return {
		__typename: 'RequestAccess',
		expireIn: 300,
		success: {
			message:
				'Benvindo ao Guup, em uns instantes você recebera um e-mail com o link de acesso',
		},
	}
}

export const serviceAuthSignin = async ({
	email,
	tokenAccess,
}: InputSigin): Promise<SigninResponse> => {
	const verificationRef = db.collection(collections.verification)
	const userRef = db.collection(collections.users)
	const verify = await verificationRef.where('email', '==', email).get()
	if (!verify.size) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: EErrorCode.NOT_FOUND,
				message:
					'Seu e-mail ou token de acesso não foram encontrados, tente novamente ou gere um novo token',
			},
		}
	}
	let verificaionData: Verificationdata = {}
	verify.forEach((data) => {
		verificaionData = { id: data.id, ...data.data() }
	})
	console.log('verificaionData', verificaionData)
	const verificationToken: any = await verifyAccessToken(
		verificaionData.encript || ''
	)
	if (verificationToken.err) {
		await verificationRef.doc(verificaionData.id || '').delete()
		return {
			__typename: 'ErrorResponse',
			error: verificationToken.err,
		}
	}
	const decodeToken: Verificationdata = await decodeAccessToken(
		verificaionData.encript || ''
	)
	if (decodeToken.token !== tokenAccess) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: EErrorCode.NOT_FOUND,
				message: 'Token de acesso inválido, tente novamente',
			},
		}
	}
	await verificationRef.doc(verificaionData.id || '').delete()
	// Verify if user exists or is a new user
	const verifyUser = await userRef.where('email', '==', email).get()
	if (!verifyUser.size) {
		return {
			__typename: 'SigInSuccess',
			success: {
				type: TypesSignInUsers.NEW_USERS,
				message:
					'Está é a tua primeira vez aqui certo? bora cadastrar algumas informações',
			},
		}
	}
	// Building user data and token session
	let user: User = {}
	verifyUser.forEach((data) => {
		const { profile, role }: User = data.data()
		user = {
			uid: data.id,
			profile,
			role,
		}
	})
	const { token, refreshToken } = jwtGenerateToken({
		user,
		roles: user.role || '',
	})
	return {
		__typename: 'SigInSuccess',
		access: {
			token,
			refreshToken,
		},
		user,
		success: {
			type: TypesSignInUsers.OLD_USERS,
			message: 'Benvindo ao guup, em uns instantes você será direcionado :)',
		},
	}
}

export const serviceAuthSignup = async ({
	user,
}: InputSignup): Promise<SignupResponse> => {
	const userRef = db.collection(collections.users)
	// find if exists user with same email or phone
	const emailExists = await userRef.where('email', '==', user.email).get()
	if (emailExists.size) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: EErrorCode.ALREADY_EXISTS,
				message: 'Já existe um usuario cadastrado com esse e-mail',
			},
		}
	}
	const phoneExists = await userRef
		.where('phoneNumber', '==', user.phoneNumber)
		.get()
	if (phoneExists.size) {
		return {
			__typename: 'ErrorResponse',
			error: {
				type: EErrorCode.ALREADY_EXISTS,
				message: 'Já existe um usuario cadastrado com esse telefone',
			},
		}
	}
	// Inserting new user
	const completeUser: User = {
		email: user.email,
		phoneNumber: user.phoneNumber,
		role: user.role,
		profile: {
			displayName: user.displayName,
		},
	}
	const newUserId = await userRef.add(completeUser)
	const newUser: User = {
		...completeUser,
		uid: newUserId.id,
	}
	const { token, refreshToken } = jwtGenerateToken({
		user: newUser,
		roles: user.role || '',
	})
	return {
		__typename: 'SignUpSuccess',
		access: {
			token,
			refreshToken,
		},
		user: { ...completeUser },
		success: {
			message: 'User created successfull',
		},
	}
	// return new Promise((resolve, reject) => {
	// 	firebase
	// 		.auth()
	// 		.createUser(args)
	// 		.then((userRecord) => {
	// 			resolve({
	// 				__typename: 'SignUpSuccess',
	// 				user: { ...userRecord },
	// 				success: {
	// 					message: 'User created successfull',
	// 				},
	// 			})
	// 		})
	// 		.catch(({ code, message }: FirebaseError) => {
	// 			console.log('serviceOnCreateAuth message:', code)
	// 			resolve({
	// 				__typename: 'ErrorResponse',
	// 				error: { ...ErrorGenerator(code, message) },
	// 			})
	// 		})
	// 		.catch((error) => {
	// 			reject(error)
	// 		})
	// })
}

export const serviceOnCreateAuth = (
	uid: string,
	{ user: { displayName, ...args } }: InputSignup
): Promise<ExtendSignupResponse> => {
	const user: User = {
		uid,
		...args,
		profile: {
			displayName,
		},
	}
	const userRef = db.collection(collections.users)
	return new Promise((resolve, reject) => {
		userRef
			.doc(uid)
			.create(user)
			.then((data) => {
				resolve({
					__typename: 'SignUpSuccess',
					extendedSignup: data,
					success: {
						message: 'Extended user information added',
					},
				})
			})
			.catch(({ code }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code) },
				})
			})
			.catch((error) => {
				reject(error)
			})
	})
}

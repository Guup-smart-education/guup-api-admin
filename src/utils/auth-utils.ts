// import './../config/enviroment'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { AuthData } from './../models/auth'

// dotenv.config({
// 	default_node_env: 'development',
// 	silent: true,
// })

enum JwtCenarios {
	TokenAccessVerified = 'TOKEN_VERIFIED',
	TokenExpiredError = 'TOKEN_EXPIRED',
	JsonWebTokenError = 'TOKEN_ERROR',
	NotBeforeError = 'TOKEN_ERROR',
}

enum JwtErrorMessages {
	TokenExpiredError = 'Seu token de acesso expirou, gere outro novamente',
	NotBeforeError = 'Aconteceu um erro na validacão das informações, tente novamente ou gere um token novo',
}

export const getUserScope = (token: string): any => {
	const cleanToken = token.replace(`${process.env.AUTH_PREFIX_HEADER} `, '')
	const tokenDecode = jwt.decode(cleanToken)
	console.log('**********getUserScope**********')
	console.log('token: ', token)
	console.log('cleanToken: ', cleanToken)
	console.log('tokenDecode: ', tokenDecode)
	console.log('**********getUserScope**********')
	return tokenDecode || {}
}

export const jwtGenerateToken = ({ user, roles }: AuthData): any => {
	return {
		token: jwt.sign(
			{
				user,
				roles,
			},
			`${process.env.AUTH_PUBLIC_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: process.env.AUTH_SESSION_TOKEN_MAXAGE,
			}
		),
		refreshToken: jwt.sign(
			{
				type: 'refresh',
			},
			`${process.env.AUTH_PUBLIC_KEY}`,
			{
				algorithm: 'HS256',
				expiresIn: process.env.AUTH_SESSION_REFRESH_TOKEN_MAXAGE,
			}
		),
	}
}

export const decodeAccessToken = (token: string): any => {
	return jwt.decode(token) || {}
}

export const createAccessToken = (data: any): any => {
	return jwt.sign(
		{
			...data,
		},
		`${process.env.AUTH_PUBLIC_KEY}`,
		{
			algorithm: 'HS256',
			expiresIn: process.env.AUTH_ACCESS_TOKEN_MAXAGE,
		}
	)
}

export const verifyAccessToken = (token: string): any => {
	return jwt.verify(
		token,
		`${process.env.AUTH_PUBLIC_KEY}`,
		{
			algorithms: ['HS256'],
			maxAge: process.env.AUTH_ACCESS_TOKEN_MAXAGE,
		},
		(err: any) => {
			if (err) {
				const { name }: JsonWebTokenError = err
				return {
					err: {
						type: (JwtCenarios as any)[name],
						message: (JwtErrorMessages as any)[name],
					},
				}
			}
			return { result: JwtCenarios.TokenAccessVerified }
		}
	)
}

export const verifySessionToken = (token: string): any => {
	return jwt.verify(
		token,
		`${process.env.AUTH_PUBLIC_KEY}`,
		{
			algorithms: ['HS256'],
			maxAge: process.env.AUTH_ACCESS_TOKEN_MAXAGE,
		},
		(err: any) => {
			if (err) {
				const { name }: JsonWebTokenError = err
				return { err: (JwtCenarios as any)[name] }
			}
			return { result: JwtCenarios.TokenAccessVerified }
		}
	)
}

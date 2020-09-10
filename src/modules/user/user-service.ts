import { User } from './../../entities/user'
import {
	GetUserResponse,
	GetAllUsersResponse,
	CreateUserResponse,
	UpdateProfileResponse,
} from './user'
import { firebase, db, collections } from './../../firebase/firebase'
import { ErrorGenerator } from './../../utils/error-utils'
import { FirebaseError } from 'firebase-admin'

export const serviceGetUser = (uid: string): Promise<GetUserResponse> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.users)
			.doc(uid)
			.get()
			.then((data) => {
				const user = data.data()
				console.log('GetUserResponse', user)
				resolve({
					__typename: 'GetUser',
					user,
					success: {
						message: user
							? 'Usuaruio encontrado com sucesso'
							: 'O usuario não encontrado',
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

export const serviceGetAuthUsers = (): Promise<GetAllUsersResponse> => {
	return new Promise((resolve, reject) => {
		firebase
			.auth()
			.listUsers()
			.then(({ users }) => {
				resolve({
					__typename: 'GetAllUsers',
					allUsers: users,
					success: {
						message: 'All users founded successfull',
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

export const serviceGetAllUsers = (): Promise<GetAllUsersResponse> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.users)
			.get()
			.then((data) => {
				let users: Array<User> = []
				data.forEach((doc) => {
					users.push({ ...doc.data() })
				})
				return resolve({
					__typename: 'GetAllUsers',
					allUsers: users,
					success: {
						message: 'Getting all current users successfull',
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

export const serviceCreateUser = (user: User): Promise<CreateUserResponse> => {
	const usersRef = db.collection(collections.users)
	return new Promise((resolve, reject) => {
		usersRef
			.add({ ...user })
			.then(({ id }) => {
				return resolve({
					__typename: 'CreateUser',
					createuser: { uid: id, ...user },
					success: {
						message: 'User created successfull',
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

export const serviceUpdateProfile = (
	uid: string,
	user: User
): Promise<UpdateProfileResponse> => {
	const usersRef = db.collection(collections.users).doc(uid)
	return new Promise((resolve, reject) => {
		usersRef
			.update({ ...user })
			.then((data) => {
				return resolve({
					__typename: 'UpdateProfile',
					updateprofile: { ...data },
					success: {
						message: 'User profile updated successfull',
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

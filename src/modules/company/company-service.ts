import {
	// Gets
	GetCompanies,
	GetCompany,
	// Posts
	PostCompany,
	// Inputs
	IGetCompanyID,
	IInsertCompany,
} from './company'
import { ErrorGenerator } from './../../utils/error-utils'
import { db, collections } from './../../firebase/firebase'
import { FirebaseError } from 'firebase-admin'
import { Company } from '../../entities/company'

// Gets

export const serviceGetCompanies = (): Promise<GetCompanies> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.company)
			.get()
			.then((data) => {
				let companies: Array<Company> = []
				data.forEach((company) => {
					companies.push({ id: company.id, ...company.data() })
				})
				resolve({
					__typename: 'GetCompanies',
					companies,
					success: {
						message: 'All companies ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

export const serviceGetCompanyByID = ({
	id,
}: IGetCompanyID): Promise<GetCompany> => {
	return new Promise((resolve, reject) => {
		db.collection(collections.company)
			.doc(id)
			.get()
			.then((data) => {
				const company = { id: data.id, ...data.data() }
				resolve({
					__typename: 'GetCompany',
					company,
					success: {
						message: !company
							? `There is not a company with id: ${id}`
							: 'All companies ready',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

// Posts

export const serviceInsertCompany = ({
	company,
}: IInsertCompany): Promise<PostCompany> => {
	console.log('serviceInsertCompany', company)
	return new Promise((resolve, reject) => {
		db.collection(collections.company)
			.add(company)
			.then((data) => {
				resolve({
					__typename: 'PostCompany',
					company: data.id,
					success: {
						message: 'Company added succesfully',
					},
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				resolve({
					__typename: 'ErrorResponse',
					error: { ...ErrorGenerator(code, message) },
				})
			})
			.catch(({ code, message }: FirebaseError) => {
				reject({ ...ErrorGenerator(code, message) })
			})
	})
}

import { ECompanyTypesNames } from './company-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Company } from './../../entities/company'

interface TypeName {
	__typename: keyof typeof ECompanyTypesNames
}

// Gets
export interface GetCompanies extends TypeName, success, error {
	companies?: Array<Company> | []
}

export interface GetCompany extends TypeName, success, error {
	company?: Company
}

// Posts
export interface PostCompany extends TypeName, success, error {
	company?: string
}

// Inputs
export interface IGetCompanyID {
	id: string
}

export interface IInsertCompany {
	company: Company
}

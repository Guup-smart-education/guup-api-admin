import { ECompanyTypesNames } from './company-enum'
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
import {
	serviceGetCompanies,
	serviceGetCompanyByID,
	serviceInsertCompany,
} from './company-service'

const resolvers = {
	UGetCompanies: {
		__resolveType: (obj: GetCompanies, contex: any, info: any) => {
			if (obj.companies) return ECompanyTypesNames.GetCompanies
			if (obj.error) return ECompanyTypesNames.ErrorResponse
			return null
		},
	},
	UGetCompany: {
		__resolveType: (obj: GetCompany, contex: any, info: any) => {
			if (obj.company) return ECompanyTypesNames.GetCompany
			if (obj.error) return ECompanyTypesNames.ErrorResponse
			return null
		},
	},
	UCreateCompany: {
		__resolveType: (obj: PostCompany, contex: any, info: any) => {
			if (obj.company) return ECompanyTypesNames.PostCompany
			if (obj.error) return ECompanyTypesNames.ErrorResponse
			return null
		},
	},
	Query: {
		getAllCompanies: async (): Promise<GetCompanies> => {
			return await serviceGetCompanies()
		},
		getAllCompanyByID: async (
			obj: any,
			company: IGetCompanyID,
			context: any
		): Promise<GetCompany> => {
			return await serviceGetCompanyByID(company)
		},
	},
	Mutation: {
		createCompany: async (
			obj: any,
			company: IInsertCompany,
			context: any
		): Promise<PostCompany> => {
			return await serviceInsertCompany(company)
		},
	},
}

export default resolvers

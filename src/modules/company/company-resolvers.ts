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

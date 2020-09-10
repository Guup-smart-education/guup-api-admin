import R from 'ramda'
import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver, GraphQLField } from 'graphql'

export class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field: GraphQLField<any, any>) {
		const { resolve = defaultFieldResolver } = field
		field.resolve = async (...args) => {
			const [, , context] = args
			const { user } = context
			if (user || R.isEmpty(user)) {
				return resolve.apply(this, args)
			}
			throw new Error(
				'Your session has expired, or you are not authorized for this resource'
			)
		}
	}
}

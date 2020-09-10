import R from 'ramda'
import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver, GraphQLField } from 'graphql'

export class RolesDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field: GraphQLField<any, any>) {
		const { resolve = defaultFieldResolver } = field
		const { userRoles } = this.args
		field.resolve = async (...args: any) => {
			const [, , context] = args
			const { user, roles } = context
			if ((user || R.isEmpty(user)) && roles && userRoles.includes(roles)) {
				return resolve.apply(this, args)
			}
			throw new Error(`You don't have ${userRoles} permissions to do this`)
		}
	}
}

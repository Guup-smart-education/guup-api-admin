import './config/enviroment'
import express, { Application, Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { getUserScope } from './utils/auth-utils'
import typeDefs from './graphql/types-defs'
import resolvers from './graphql/resolvers'
import { AuthDirective } from './directives/auth-directive'
import { RolesDirective } from './directives/role-directive'
import { MuxWebhooks } from './webhooks/muxHooks'
import { makeExecutableSchema } from '@graphql-tools/schema'

interface Context {
	req: Request
}

console.log('**********ENVIROMENT**********')
console.log(`**********${process.env.ENV_NAME}**********`)
console.log('**********ENVIROMENT**********')

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
	schema,
	schemaDirectives: {
		auth: AuthDirective,
		hasRole: RolesDirective,
	},
	context: (context: Context) => {
		if (!context) return
		const token = context.req.headers.authorization || ''
		const scope = getUserScope(token)
		return scope
	},
	playground: true,
	introspection: true,
})

const app: Application = express()

const PORT = process.env.PORT || 8090

app.use('/guup/api', MuxWebhooks)

server.applyMiddleware({ app, path: '/graphql' })

app.listen(PORT, () => {
	console.log(`Listening app ${PORT}`)
})

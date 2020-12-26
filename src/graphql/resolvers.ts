import path from 'path'
import { mergeResolvers, loadFilesSync } from 'graphql-tools'

const ENV = process.env.ENV_NAME === 'development'

const resolversArray = loadFilesSync(
	path.join(process.cwd(), `./../**/*-resolvers.${ENV ? 'ts' : 'js'}`)
)

console.log('resolversArray: ', resolversArray.length)

const resolvers = mergeResolvers(resolversArray)

console.log('resolvers: ', resolvers)

export default resolvers

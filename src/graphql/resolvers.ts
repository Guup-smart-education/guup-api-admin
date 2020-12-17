import path from 'path'
import { mergeResolvers, loadFilesSync } from 'graphql-tools'

const resolversArray = loadFilesSync(
	path.join(process.cwd(), './../**/*-resolvers.ts')
)

console.log('resolversArray: ', resolversArray.length)

const resolvers = mergeResolvers(resolversArray)

console.log('resolvers: ', resolvers)

export default resolvers

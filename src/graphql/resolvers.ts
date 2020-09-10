import path from 'path'
import { mergeResolvers, loadFilesSync } from 'graphql-tools'

const resolversArray = loadFilesSync(
	path.join(__dirname, './../**/*-resolvers.ts')
)

export default mergeResolvers(resolversArray)

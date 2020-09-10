import path from 'path'
import { mergeTypeDefs, loadFilesSync } from 'graphql-tools'

const typesArray = loadFilesSync(path.join(__dirname, './../**/*.gql'))

export default mergeTypeDefs(typesArray)

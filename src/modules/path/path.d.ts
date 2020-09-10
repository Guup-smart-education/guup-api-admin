import { EPathTypesNames } from './path-enum'
import { success } from './../../models/success'
import { error } from './../../models/error'
import { Path } from './../../entities/path'

interface TypeName {
	__typename: keyof typeof EPathTypesNames
}

// Gets
export interface GetPathList extends TypeName, success, error {
	allPaths?: Array<Path> | []
}

export interface GetPath extends TypeName, success, error {
	path?: Path
}

// Paths
export interface PostCreatePath extends TypeName, success, error {
	createPath?: string
}

// Inputs
export interface IGetPathOwner {
	owner?: string
}

export interface IGetPathID {
	id: string
}

export interface ICreatePath {
	path: Path
}

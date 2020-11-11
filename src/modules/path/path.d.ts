import { EPathTypesNames, EPathAccess, EPathStatus } from './path-enum'
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

export interface GetPathListOwner extends TypeName, success, error {
	allPathsOwner?: Array<Path> | []
}

export interface GetPath extends TypeName, success, error {
	path?: Path
}

// Paths
export interface PostCreatePath extends TypeName, success, error {
	createPath?: string
}

export interface PostUpdateStatusPath extends TypeName, success, error {
	updateStatus?: string
}

// Inputs
export interface IGetPathOwner {
	lastPath?: string
	owner?: string
}

export interface IGetPathID {
	id: string
}

export interface ICreatePath {
	path: Path
	access: keyof typeof EPathAccess
	status: keyof typeof EPathStatus
}

export interface IUpdateStatusPath {
	path: string
	status: keyof typeof EPathStatus
}

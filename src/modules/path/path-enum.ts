export enum EPathTypesNames {
	'GetPaths' = 'GetPaths',
	'GetPathsOwner' = 'GetPathsOwner',
	'GetPath' = 'GetPath',
	'CreatePath' = 'CreatePath',
	'UpdatedStatusPath' = 'UpdatedStatusPath',
	'ErrorResponse' = 'ErrorResponse',
}

export enum EPathAccess {
	'LIMIT_ACCESS' = 'LIMIT_ACCESS',
	'FOR_EVERYONE' = 'FOR_EVERYONE',
}

export enum EPathStatus {
	'WAITING' = 'WAITING',
	'PUBLISHED' = 'PUBLISHED',
	'DELETED' = 'DELETED',
	'PAUSED' = 'PAUSED',
}

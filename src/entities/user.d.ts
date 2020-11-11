import { GuupLevels, GuupUserRole } from './../data/enums'

export interface Profile {
	// displayName?: string
	// profission?: string
	// photoURL?: string
	// presentation?: string
	// experience?: string
	// bio?: string
	uid?: string
	displayName?: string
	photoURL?: string
	thumbnailURL?: string
	profission?: string
	presentation?: string
	bio?: string
	experience?: string
	role?: keyof typeof GuupUserRole
}

export interface Skill {
	skillName: string
	skillLevel: keyof typeof GuupLevels
	skillArea: string
}

export interface Achievements {
	achievement?: string
	achievementDescription?: string
}

export interface User {
	uid?: string
	email?: string
	password?: string
	emailVerified?: Boolean
	phoneNumber?: string
	disabled?: Boolean
	passwordHash?: string
	passwordSalt?: string
	tokensValidAfterTime?: String
	tenantId?: String
	role?: keyof typeof GuupUserRole
	profile?: Profile
	skills?: [Skill]
	achievements?: [Achievement]
}

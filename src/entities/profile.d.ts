import { error } from './../models/error'
import { success } from './../models/success'
import { status } from './../models/status'

export interface Profile extends success {
	userName?: string
	userRole?: string
	userPresentation?: string
	userExperience?: string
}

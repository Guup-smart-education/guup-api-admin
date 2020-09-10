import { success } from './../models/success'

export interface Path extends success {
	id?: string
	owner?: string
	title?: string
	description?: string
	views?: Number
	comments?: Number
	claps?: Number
	disabled?: Boolean
	areas?: [string] | []
}

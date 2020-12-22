import * as dotenv from 'dotenv-flow'
import nodemailer from 'nodemailer'

// Smtp config
const smtp = require('./../../configs/smtp/smtp.json')

dotenv.config({
	default_node_env: 'development',
	silent: true,
})

interface emailConfig {
	to: string
	subject: string
	text?: string
	html?: string
}

const emailTransporter = nodemailer.createTransport(smtp)

export const sendGuupEmail = (data: emailConfig) => {
	return emailTransporter.sendMail(
		{
			from: process.env.EMAIL_AUTH_SENDER,
			...data,
		},
		(err: Error | null, info: any) => ({ err, info })
	)
}

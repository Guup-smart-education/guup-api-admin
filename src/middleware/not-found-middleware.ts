import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	const message = "Opps!! Guup say: 'Something it's not good'"

	response.status(404).send(message)
}

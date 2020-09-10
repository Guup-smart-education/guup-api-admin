export enum EErrorCode {
	'ERROR' = 'ERROR',
	'UNKNOWN' = 'UNKNOWN',
	'INVALID_ARGUMENT' = 'INVALID_ARGUMENT',
	'NOT_FOUND' = 'NOT_FOUND',
	'ALREADY_EXISTS' = 'ALREADY_EXISTS',
	'PERMISSION_DENIED' = 'PERMISSION_DENIED',
	'UNAUTHENTICATED' = 'UNAUTHENTICATED',
	'INTERNAL' = 'INTERNAL',
	'UNAVAILABLE' = 'UNAVAILABLE',
	'EXPIRED' = 'EXPIRED',
}

type TErrorBody = {
	type: string
	message: string
}

const getErrorMessage = (code: string, message: string): TErrorBody => {
	switch (code) {
		case '0':
			return {
				type: EErrorCode.ERROR,
				message: `Aconteceu um problema, tente novamente`,
			}
		case '2':
			return {
				type: EErrorCode.UNKNOWN,
				message: `Algo aconteceu, tente novamente, se o erro persiste, entre em contato com o administrador`,
			}
		case '3':
			return {
				type: EErrorCode.INVALID_ARGUMENT,
				message: `As informacoes fornecidas sao invalidas, se o erro persiste, entre em contato com o administrador`,
			}
		case '5':
			return {
				type: EErrorCode.NOT_FOUND,
				message: `Informacoes nao foram encontradas, se o erro persiste, entre em contato com o administrador`,
			}
		case '6':
			return {
				type: EErrorCode.ALREADY_EXISTS,
				message: `Os dados que voce esta tentando ingresar, ja existem, entre em contato com o administrador`,
			}
		case '7':
			return {
				type: EErrorCode.PERMISSION_DENIED,
				message: `Voce nao tem permissoes para efetuar esta operacao, entre em contato com seu administrador`,
			}
		case '13':
			return { type: EErrorCode.INTERNAL, message: `Error interno do servidor` }
		case '14':
			return {
				type: EErrorCode.UNAVAILABLE,
				message: `Este recurso nao esta disponivel`,
			}
		case '16':
			return {
				type: EErrorCode.UNAUTHENTICATED,
				message: `Voce precisa estar logado para efetuar esta operacao`,
			}
		default:
			return { type: code, message }
	}
}

export const ErrorGenerator = (code: string, message: string = '') => {
	return getErrorMessage(code, message)
}

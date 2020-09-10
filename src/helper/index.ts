import R from 'ramda'

export const random = R.curry((min: number, max: number, isFloat: boolean) => {
	let range = max - min
	let random = Math.random() * range + min
	return isFloat ? random : Math.floor(random)
})

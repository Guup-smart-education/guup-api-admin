import { functions } from './../firebase'
import path from 'path'

// Sizes
const THUMB_HEIGHT = 100
const THUMB_WIDTH = 100
// Prefix
const THUMB_PREFIX = 'thumb_'

exports.generateThumbnail = functions.storage
	.object()
	.onFinalize(async (obj) => {
		const filePath = obj.name
		const contentType = obj.contentType
		const fileDir = path.basename(`${filePath}`)
		const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}`))
		console.log('filePath: ', filePath)
		console.log('contentType: ', contentType)
		console.log('fileDir: ', fileDir)
		console.log('thumbFilePath: ', thumbFilePath)
	})

import { DataCollection } from '../data/collections'
import firebaseAdmin from 'firebase-admin'

const SERVICE_ACCOUNT = require('../../configs/firebase/serviceAccount/service-account-key.json')

if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		// credential: firebaseAdmin.credential.applicationDefault(),
		credential: firebaseAdmin.credential.cert(SERVICE_ACCOUNT),
		databaseURL: `https://${process.env.GOOGLE_DATABASE_NAME}.firebaseio.com`,
	})
}
console.log('=== FIREBASE APPS ===')
console.log(
	firebaseAdmin.apps.forEach((app, i, list) => {
		if (app) {
			console.log('APP: ', app)
		}
	})
)
console.log('=== FIREBASE APPS ===')

export const db = firebaseAdmin.firestore()
export const firebase = firebaseAdmin
export const collections = DataCollection
export const storage = firebase.storage()

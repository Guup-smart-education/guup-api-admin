import { DataCollection } from '../data/collections'
import firebaseAdmin from 'firebase-admin'

const SERVICE_ACCOUNT = require('../../configs/firebase/serviceAccount/service-account-key.json')

// const ADMIN_CONFIG = JSON.parse(`${process.env.FIREBASE_CONFIG}`)

// console.log('=== ADMIN_CONFIG ===')
// console.log(ADMIN_CONFIG)
// console.log('=== ADMIN_CONFIG ===')

if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		// credential: firebaseAdmin.credential.applicationDefault(),
		credential: firebaseAdmin.credential.cert(SERVICE_ACCOUNT),
		databaseURL: `'https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
	})
}
console.log('=== FIREBASE APPS ===')
console.log(firebaseAdmin.apps)
console.log('=== FIREBASE APPS ===')

export const db = firebaseAdmin.firestore()
export const firebase = firebaseAdmin
export const collections = DataCollection
export const storage = firebase.storage()

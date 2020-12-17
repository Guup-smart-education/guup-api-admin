import { DataCollection } from '../data/collections'
import * as dotenv from 'dotenv'
import * as firebaseFuctions from 'firebase-functions'
import firebaseAdmin from 'firebase-admin'
import { admin } from 'firebase-admin/lib/database'

dotenv.config()

const serviceAccount = require(`${process.env.FIREBASE_CONFIG}`)

if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert(serviceAccount),
		databaseURL: `${process.env.GOOGLE_DATABASE_URL}`,
	})
}

export const db = firebaseAdmin.firestore()
export const functions = firebaseFuctions
export const firebase = firebaseAdmin
export const collections = DataCollection
export const storage = firebase.storage()

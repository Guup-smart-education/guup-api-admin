import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const API = axios.create({
	baseURL: `${process.env.MUX_API_URL}`,
	headers: {
		'Content-Type': 'application/json',
	},
	auth: {
		username: `${process.env.MUX_ACCESS_TOKEN_ID}`,
		password: `${process.env.MUX_SECRET_KEY}`,
	},
})

export const MuxCreateAsset = (
	input: string,
	playback_policy: [string] | string
) => {
	return new Promise((resolve, reject) => {
		API.post(`/assets`, {
			input,
			playback_policy,
		})
			.then(({ data }) => {
				console.log('MuxCreateAsset: [SUCCESS] ', data)
				resolve(data.data || data)
			})
			.catch((e) => {
				console.log('MuxCreateAsset [ERROR] ', e)
				reject(e)
			})
	})
}

export const MuxGetAsset = (assetsId: string) => {
	return new Promise((resolve, reject) => {
		API.get(`/assets/${assetsId}`)
			.then(({ data }) => {
				console.log('MuxGetAsset: [SUCCESS] ', data)
				resolve(data.data || data)
			})
			.catch((e) => {
				console.log('MuxGetAsset: [ERROR] ', e)
				reject(e)
			})
	})
}

export const MuxGetPlaybackID = (assetsId: string) => {
	return new Promise((resolve, reject) => {
		API.post(`/assets/${assetsId}/playback-ids`, {
			policy: 'public',
		})
			.then(({ data }) => {
				console.log('MUXGetPlaybackID: [SUCCESS]', data)
				resolve(data.data || data)
			})
			.catch((e) => {
				console.log('MUXGetPlaybackID: [ERROR]', e)
				reject(e)
			})
	})
}

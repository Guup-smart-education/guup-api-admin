import * as dotenv from 'dotenv-flow'
import axios from 'axios'
import { MuxAsset } from './../entities/mux.d'

dotenv.config({
	default_node_env: 'development',
	silent: true,
})

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
): Promise<MuxAsset> => {
	return new Promise((resolve, reject) => {
		API.post(`/assets`, {
			input,
			playback_policy,
		})
			.then(({ data }) => resolve(data.data || data))
			.catch((e) => {
				console.log('MuxCreateAsset [ERROR] ', e)
				reject(e)
			})
	})
}

export const MuxDeleteAsset = (assetId: string) => {
	return new Promise((resolve, reject) => {
		API.delete(`/assets/${assetId}`)
			.then((response) => {
				console.log(`Asset deleted with success: ${response.data}`)
				resolve(response)
			})
			.catch((e) => {
				console.log('MuxDeleteAsset: ', e)
				reject(e)
			})
	})
}

export const MuxGetAsset = (assetsId: string): Promise<MuxAsset> => {
	return new Promise((resolve, reject) => {
		API.get(`/assets/${assetsId}`)
			.then(({ data }) => resolve(data.data || data))
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
			.then(({ data }) => resolve(data.data || data))
			.catch((e) => {
				console.log('MUXGetPlaybackID: [ERROR]', e)
				reject(e)
			})
	})
}

export const MuxGenerateThumbnail = (videoPlaybackID: string) =>
	`https://image.mux.com/${videoPlaybackID}/thumbnail.png?width=420`

export const MuxGenerateGif = (videoPlaybackID: string) =>
	`https://image.mux.com/${videoPlaybackID}/animated.gif?fps=30&width=420`

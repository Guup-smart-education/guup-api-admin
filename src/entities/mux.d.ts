// Mux Object
export interface RecordingTime {
	started_at: Date
	duration: number
}

export interface PlaybackId {
	id: string
	policy: string
}

export interface Track {
	id: string
	type: string
	duration: number
	max_width: number
	max_height: number
	max_frame_rate: number
	max_channels?: number
	max_channel_layout: string
	text_type: string
	status: string
	passthrough: string
	name: string
	language_code: string
	closed_captions?: boolean
}

export interface File {
	name: string
	ext: string
	height: number
	width: number
	bitrate: number
	filesize: string
}

export interface StaticRenditions {
	status: string
	files: File[]
}

export interface NonStandardInputReasons {
	video_codec: string
	video_frame_rate: string
	video_gop_size: string
	pixel_aspect_ratio: string
	audio_codec: string
	video_resolution: string
	video_edit_list: string
	audio_edit_list: string
	unexpected_media_file_parameters: string
}

export interface Master {
	status: string
	url: string
}

export interface MuxAsset {
	id: string
	created_at: string
	status: string
	duration: number
	max_stored_resolution: string
	max_stored_frame_rate: number
	aspect_ratio: string
	per_title_encode: boolean
	live_stream_id: string
	recording_times: RecordingTime[]
	playback_ids: PlaybackId[]
	tracks: Track[]
	mp4_support: string
	static_renditions: StaticRenditions
	non_standard_input_reasons: NonStandardInputReasons
	master_access: string
	master: Master
	passthrough: string
	test: boolean
}

// Hooks
export interface HookObject {
	type: string
	id: string
}

export interface Environment {
	name: string
	id: string
}

export interface ResponseHeaders {}

export interface Attempt {
	address: string
	created_at: Date
	id: string
	max_attempts: number
	response_body: string
	response_headers: ResponseHeaders
	response_status_code: number
	webhook_id: number
}

export interface MuxWebHooks {
	type: keyof typeof EAssetsEvents
	created_at: Date
	object: HookObject
	id: string
	environment: Environment
	data: MuxAsset
	attempts: Attempt[]
	accessor_source?: any
	accessor?: any
	request_id?: any
}

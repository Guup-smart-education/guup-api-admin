export enum GuupLevels {
	'JUNIOR' = 'JUNIOR',
	'MIDDLE' = 'MIDDLE',
	'ADVANCE' = 'ADVANCE',
}

export enum GuupTypeContent {
	'VIDEO' = 'VIDEO',
	'ARTICLE' = 'ARTICLE',
}

export enum TypesErrors {
	'ERROR' = 'ERROR',
	'UNKNOWN' = 'UNKNOWN',
	'INVALID_ARGUMENT' = 'INVALID_ARGUMENT',
	'NOT_FOUND' = 'NOT_FOUND',
	'ALREADY_EXISTS' = 'ALREADY_EXISTS',
	'PERMISSION_DENIED' = 'PERMISSION_DENIED',
	'UNAUTHENTICATED' = 'UNAUTHENTICATED',
	'INTERNAL' = 'INTERNAL',
	'UNAVAILABLE' = 'UNAVAILABLE',
}

export enum TypesSuccess {
	'SUCCESS' = 'SUCCESS',
	'CREATED' = 'CREATED',
	'DELETED' = 'DELETED',
	'UPDATED' = 'UPDATED',
}

export enum GuupUserRole {
	'MASTER' = 'MASTER',
	'ADMIN' = 'ADMIN',
	'CREATOR' = 'CREATOR',
	'MODERATOR' = 'MODERATOR',
	'COMMON' = 'COMMON',
	'GUEST' = 'GUEST',
}

export enum EMuxEvents {
	// Assets events
	'video_asset_created' = 'video.asset.created',
	'video_asset_ready' = 'video.asset.ready',
	'video_asset_errored' = 'video.asset.errored',
	'video_asset_updated' = 'video.asset.updated',
	'video_asset_deleted' = 'video.asset.deleted',
	'video_asset_live_stream_completed' = 'video.asset.live_stream_completed',
	'video_asset_static_renditions_ready' = 'video.asset.static_renditions.ready',
	'video_asset_static_renditions_preparing' = 'video.asset.static_renditions.preparing',
	'video_asset_static_renditions_deleted' = 'video.asset.static_renditions.deleted',
	'video_asset_static_renditions_errored' = 'video.asset.static_renditions.errored',
	'video_asset_master_ready' = 'video.asset.master.ready',
	'video_asset_master_preparing' = 'video.asset.master.preparing',
	'video_asset_master_deleted' = 'video.asset.master.deleted',
	'video_asset_master_errored' = 'video.asset.master.errored',
	'video_asset_track_created' = 'video.asset.track.created',
	'video_asset_track_ready' = 'video.asset.track.ready',
	'video_asset_track_errored' = 'video.asset.track.errored',
	'video_asset_track_deleted' = 'video.asset.track.deleted',
	// Upload events
	'video_upload_asset_created' = 'video.upload.asset_created',
	'video_upload_cancelled' = 'video.upload.cancelled',
	'video_upload_created' = 'video.upload.created',
	'video_upload_errored' = 'video.upload.errored',
	// Live stream events"
	'video_live_stream_created' = 'video.live_stream.created',
	'video_live_stream_connected' = 'video.live_stream.connected',
	'video_live_stream_recording' = 'video.live_stream.recording',
	'video_live_stream_active' = 'video.live_stream.active',
	'video_live_stream_disconnected' = 'video.live_stream.disconnected',
	'video_live_stream_idle' = 'video.live_stream.idle',
	'video_live_stream_updated' = 'video.live_stream.updated',
	'video_live_stream_updated' = 'video.live_stream.updated',
	'video_live_stream_enabled' = 'video.live_stream.enabled',
	'video_live_stream_deleted' = 'video.live_stream.deleted',
	// Simulcast events"
	'video_live_stream_simulcast_target_created' = 'video.live_stream.simulcast_target.created',
	'video_live_stream_simulcast_target_idle' = 'video.live_stream.simulcast_target.idle',
	'video_live_stream_simulcast_target_starting' = 'video.live_stream.simulcast_target.starting',
	'video_live_stream_simulcast_target_broadcasting' = 'video.live_stream.simulcast_target.broadcasting',
	'video_live_stream_simulcast_target_errored' = 'video.live_stream.simulcast_target.errored',
	'video_live_stream_simulcast_target_deleted' = 'video.live_stream.simulcast_target.deleted',
}

export enum EMediaState {
	'preparing' = 'preparing',
	'ready' = 'ready',
	'errored' = 'errored',
}

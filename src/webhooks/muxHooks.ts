import express, { Request, Response, Router } from 'express'
import { serviceUpdateCourseMedia } from './../modules/courses/courses-service'
import { MuxWebHooks } from './../entities/mux'
import { EMuxEvents, EMediaState } from './../data/enums'
import bodyParser from 'body-parser'
const router: Router = express.Router()

router.get('/mux/text', (req: Request, res: Response) => {
	res.send('Mux integration is working!')
})

router.post(
	'/mux/hook',
	bodyParser.raw({ type: 'application/json' }),
	async (req: Request, res: Response) => {
		try {
			// const jsonFormattedBody: any = JSON.parse(req.body)
			const jsonFormattedBody: MuxWebHooks = JSON.parse(req.body)
			console.log('@mux/hook - jsonFormattedBody: ', jsonFormattedBody)
			console.log('jsonFormattedBody.type: ', jsonFormattedBody.type)
			switch (jsonFormattedBody.type) {
				case `${EMuxEvents.video_asset_created}`:
					console.log('@mux/hook - EMuxEvents[video.asset.created]: ')
					break
				case `${EMuxEvents.video_asset_ready}`:
					console.log('@mux/hook - EMuxEvents[video.asset.ready]: ')
					await serviceUpdateCourseMedia(
						`${jsonFormattedBody.data.id}`,
						EMediaState.ready
					)
					break
				case `${EMuxEvents.video_asset_errored}`:
					await serviceUpdateCourseMedia(
						`${jsonFormattedBody.data.id}`,
						EMediaState.errored
					)
					console.log('@mux/hook - EMuxEvents[video.asset.errored]: ')
					break
				default:
					break
			}
			res.json({ received: true })
			res.status(200).end()
		} catch (error) {
			res.status(400).send(`Webhook error: ${error.message}`)
		}
	}
)

export const MuxWebhooks: Router = router

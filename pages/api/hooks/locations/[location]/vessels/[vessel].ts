import ot from '@opentelemetry/api'
import FBC from '@tack/fbc-client'
import { parseISO } from 'date-fns'
import { NextApiHandler } from 'next'

if (!process.env.FBC_USERNAME || !process.env.FBC_PASSWORD) {
	console.error('FBC_USERNAME and FBC_PASSWORD must be set in the environment')
	throw new Error('Internal Server Error')
}

const fbc = new FBC({
	username: process.env.FBC_USERNAME,
	password: process.env.FBC_PASSWORD,
})

/**
 * @swagger
 * /locations/{location}/vessels/{vessel}:
 *   post:
 *     description: Generates a new vessel availability record for the provided date
 *     responses:
 *       204:
 *         description: Successfully received the request
 */
const vessel: NextApiHandler = async (req, res) => {
	const span = ot.trace.getSpan(ot.context.active())

	if (req.method === 'POST') {
		const locationId = req.query.location
		const vesselId = req.query.vessel

		if (Array.isArray(locationId) || Array.isArray(vesselId)) {
			console.log('req.query', { ...req.query })
			res.status(400).send('400 - Bad Request')
		} else {
			const dateString = req.body.date

			if (!dateString) {
				res.status(400).send('400 - Bad Request')
			} else {
				console.log(
					await fbc.getVesselAvailabilities(
						locationId,
						vesselId,
						parseISO(dateString),
					),
				)

				res.status(204).send('')
			}
		}
	} else {
		res.status(405).send('405 - Method Not Allowed')
	}

	span && span.end()
}

export default vessel

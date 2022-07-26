import ot from '@opentelemetry/api'
import { NextApiHandler } from 'next'

const pulse: NextApiHandler = async (req, res) => {
	const span = ot.trace.getTracer('default').startSpan('pulse')

	if (req.method === 'POST') {
		console.log('req.query', { ...req.query })

		// Triggers jobs to fire
		res.status(204).send('')
	} else {
		res.status(405).send('405 - Method Not Allowed')
	}

	span.end()
}

export default pulse

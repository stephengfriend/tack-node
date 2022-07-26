import { Command } from '@oclif/core'
import FBC from '../../fbc-client'

export default class Location extends Command {
	static description = "Fetch a location's classifications"
	static args = [{ name: 'locationId' }]

	async run() {
		if (!process.env.FBC_USERNAME || !process.env.FBC_PASSWORD) {
			console.log('username:', process.env.FBC_USERNAME)
			console.log('password:', process.env.FBC_PASSWORD)

			throw new Error(
				'Must provide FBC_USERNAME and FBC_PASSWORD in the environment',
			)
		}

		const { args } = this.parse(Location)

		const fbc = new FBC({
			username: process.env.FBC_USERNAME,
			password: process.env.FBC_PASSWORD,
		})

		console.log(await fbc.getVesselClassesByLocation(args.locationId))
	}
}

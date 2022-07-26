import { Command } from '@oclif/core'
import chalk from 'chalk'
import FBC from '../../fbc-client'

export default class Locations extends Command {
	static description = 'Fetch a list of locations'

	async run() {
		if (!process.env.FBC_USERNAME || !process.env.FBC_PASSWORD) {
			console.log('username:', process.env.FBC_USERNAME)
			console.log('password:', process.env.FBC_PASSWORD)

			throw new Error(
				'Must provide FBC_USERNAME and FBC_PASSWORD in the environment',
			)
		}

		const fbc = new FBC({
			username: process.env.FBC_USERNAME,
			password: process.env.FBC_PASSWORD,
		})

		const locations = await fbc.getLocations()

		locations
			.map(
				(loc) =>
					`${chalk.grey(`  ${loc.id}`.slice(-3))} - ${chalk.bold.green(
						`${loc.name}${loc.description ? `: ${loc.description}` : ``}`,
					)}${loc.details ? ` (${loc.details})` : ``}`,
			)
			.forEach((loc) => console.log(loc))

		return locations
	}
}

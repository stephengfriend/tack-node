import { Command, Flags } from '@oclif/core'
import { add, nextSaturday, nextSunday } from 'date-fns'

import Debug from '../../debug'
import FBC, { Availability, Location, Reservation, Vessel } from '../../fbc-client'

const debug = Debug('fbc')

export default class Vessels extends Command {
	static description = 'Fetch a list of vessels by location'
	static flags = { location: Flags.integer({ required: false }) }

	async run(): Promise<Reservation[][]> {
		if (!process.env.FBC_USERNAME || !process.env.FBC_PASSWORD) {
			console.log('username:', process.env.FBC_USERNAME)
			console.log('password:', process.env.FBC_PASSWORD)

			throw new Error(
				'Must provide FBC_USERNAME and FBC_PASSWORD in the environment',
			)
		}

		const { flags } = await this.parse(Vessels)

		debug(`flags: \n${JSON.stringify(flags, null, 2)}`)

		const fbc = new FBC({
			username: 'freedom.boat.club.9pia13iz@stephengfriend.com',
			password: 'MmZ7L3Hnuqm4rXpVR9mKZezfdcWk4JCWC',
		})

		let locations = await fbc.getLocations()

		debug(`locations: \n${JSON.stringify(locations, null, 2)}`)

		if (flags.location) {
			locations = locations.filter(({ id }) => id === flags.location)
		}

		const now = new Date()
		const dates = [
			nextSaturday(now),
			// nextSunday(now),
			// add(nextSaturday(now), { weeks: 1 }),
			// add(nextSunday(now), { weeks: 1 }),
			// add(nextSaturday(now), { weeks: 2 }),
			// add(nextSunday(now), { weeks: 2 }),
			// add(nextSaturday(now), { weeks: 3 }),
			// add(nextSunday(now), { weeks: 3 }),
			// add(nextSaturday(now), { weeks: 4 }),
			// add(nextSunday(now), { weeks: 4 }),
		]

    let byLocation: Reservation[][] = [];

		for (let i = 0; i < locations.length; i++) {
			const { id: locationId } = locations[i]

			let reservations: Reservation[] = []

			for (const date of dates) {
				reservations = reservations.concat(
					await fbc
						.getReservationsByLocation({
							locationId,
							date,
						})
						.then((reservation) => {
							return reservation.filter((reservation) => {
                console.log(reservation)
								return reservation.availability !== Availability.NONE
							}).map((reservation) => {
                return new Reservation(locations.filter(({ id }) => id === locationId)[0], reservation.vessel, reservation.date, reservation.availability);
              })
						}),
				)
			}

			byLocation.push(reservations)
		}

		// const vesselsWithAvailabilities = await Promise.all(
		// 	available.map(async (vessel) => {
		// 		return {
		// 			...vessel,
		// 			availabilities: [
		// 				await fbc.getReservations(
		// 					vessel.locationId,
		// 					vessel.id,
		// 					vessel.availabilities[0].date,
		// 				),
		// 			],
		// 		}
		// 	}),
		// )

		this.log(
			JSON.stringify(
				byLocation,
				null,
				2,
			),
		)

		return byLocation;
	}
}

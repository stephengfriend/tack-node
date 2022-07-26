import { format as formatDate, isWeekend } from 'date-fns'
import { ensureConnection } from '../lib/database'
import Debug from '../lib/debug'
import {
	AvailabilityCheck,
	AvailabilityState,
} from '../lib/entities/availability-check.entity'
import { Location } from '../lib/entities/location.entity'
import { Vessel } from '../lib/entities/vessel.entity'
import FBC from '../lib/fbc-client'

const debug = Debug('ingest')

const fbc = new FBC({
	username: 'freedom.boat.club.9pia13iz@stephengfriend.com',
	password: 'MmZ7L3Hnuqm4rXpVR9mKZezfdcWk4JCWC',
})

;(async () => {
	const connection = await ensureConnection()

	debug('Fetching locations')
	let locations = await fbc.getLocations()
	debug('Locations fetched:', locations)

	// Upsert locations
	connection
		.createQueryBuilder()
		.insert()
		.into(Location)
		.values(locations)
		.orUpdate({
			conflict_target: ['id'],
			overwrite: ['name', 'description', 'details'],
		})
		.execute()

	for (const location of locations) {
		const { id: locationId, name } = location
		debug(`Fetching vessel classifications for ${locationId}: ${name}`)
		const classifications = await fbc.getVesselClassesByLocation(locationId)
		debug(`Classifications for ${locationId}: ${name}`)
		debug(classifications)

		let availabilities: {
			id: number
			date: Date
			name: string
			hasAvailability: boolean
		}[] = []

		if (!classifications) {
			// Get 1 days worth
		} else {
			for (const classification of classifications) {
				if (classification.id !== 2) {
					debug(
						`Fetching vessel availabilities for ${classification.name} (${classification.id}) at ${locationId}: ${name}`,
					)
					const vesselAvailabilities = await fbc.getVesselsByLocation({
						classification: classification.id,
						locationId: locationId,
					})
					debug(`Vessel availabilities fetched:`, vesselAvailabilities)
					availabilities = availabilities.concat(vesselAvailabilities)
					debug(`Total is ${availabilities.length} at ${locationId}: ${name}`)
				}
			}
		}

		debug(`Extracting vessels from availabilities at ${locationId}: ${name}`)
		const vessels = availabilities.reduce((acc, vessel) => {
			if (!acc.find(({ id }) => id === vessel.id)) {
				acc.push({ id: vessel.id, name: vessel.name })
			}
			return acc
		}, <{ id: number; name: string }[]>[])
		debug(`Extracted vessels:`, vessels)

		// Upsert locations
		connection
			.createQueryBuilder()
			.insert()
			.into(Vessel)
			.values(vessels)
			.orUpdate({
				conflict_target: ['id'],
				overwrite: ['name'],
			})
			.execute()

		debug(`Checking availabilities at ${locationId}: ${name}`)
		const checks: any[] = []
		for (const availability of availabilities) {
			const { id: vesselId, date, hasAvailability } = availability

			const check = {
				date,
				vesselId,
				locationId,
				availability: hasAvailability
					? AvailabilityState.ALL_DAY
					: AvailabilityState.NONE,
			}

			if (hasAvailability && isWeekend(date)) {
				debug(
					`Vessel ${vesselId} hasAvailability && isWeekend on ${formatDate(
						date,
						'yyyy-MM-dd',
					)} at ${locationId}: ${name}`,
				)
				const { am, pm } = await fbc.getVesselAvailabilities(
					locationId,
					vesselId,
					date,
				)
				if (!am) {
					check.availability = AvailabilityState.EVENING
				}
				if (!pm) {
					check.availability = AvailabilityState.MORNING
				}
				debug(`Vessel weekend check result: ${check.availability}`)
			}

			checks.push(check)
			debug(`Availability check added. Total: ${checks.length}`)
		}

		// Upsert locations
		connection
			.createQueryBuilder()
			.insert()
			.into(AvailabilityCheck)
			.values(checks)
			.execute()
	}
})()

import { Connection, getConnectionManager } from 'typeorm'
import { AvailabilityCheck } from '../entities/availability-check.entity'
import { Location } from '../entities/location.entity'
import { Reservation } from '../entities/reservation.entity'
import { Vessel } from '../entities/vessel.entity'

const options = {
	default: {
		type: 'postgres',
		host: 'pg',
		post: 5432,
		username: 'postgres',
		password: 'postgres',
		database: 'postgres',
		//		url: process.env.DATABASE_URL,
		logging: process.env.NODE_ENV !== 'production',
		synchronize: process.env.NODE_ENV !== 'production',
		entities: [AvailabilityCheck, Location, Reservation, Vessel],
	},
}

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
	if (prevEntities.length !== newEntities.length) return true

	for (let i = 0; i < prevEntities.length; i++) {
		if (prevEntities[i] !== newEntities[i]) return true
	}

	return false
}

async function updateConnectionEntities(
	connection: Connection,
	entities: any[],
) {
	if (!entitiesChanged(connection.options.entities || [], entities)) return

	// @ts-ignore
	connection.options.entities = entities

	// @ts-ignore
	connection.buildMetadatas()

	if (connection.options.synchronize) {
		await connection.synchronize()
	}
}

export async function ensureConnection(
	name: string = 'default',
): Promise<Connection> {
	const connectionManager = getConnectionManager()

	if (connectionManager.has(name)) {
		const connection = connectionManager.get(name)

		if (!connection.isConnected) {
			await connection.connect()
		}

		if (process.env.NODE_ENV !== 'production') {
			// @ts-ignore
			await updateConnectionEntities(connection, options[name].entities)
		}

		return connection
	}

	// @ts-ignore
	return await connectionManager.create({ name, ...options[name] }).connect()
}

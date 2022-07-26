import { ensureConnection } from '@tack/database'
import {
	ApolloServerPluginInlineTrace,
	ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core'
import { DataSources } from 'apollo-server-core/dist/graphqlOptions'
import { ApolloServer } from 'apollo-server-micro'
import * as path from 'path'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { LocationResolver } from './resolvers/location.resolver'
import { ReservationResolver } from './resolvers/reservation.resolver'
import { VesselResolver } from './resolvers/vessel.resolver'

const notProduction = process.env.NODE_ENV !== 'production'

// build TypeGraphQL executable schema
const schema = await buildSchema({
	resolvers: [LocationResolver, ReservationResolver, VesselResolver],
	// automatically create `schema.gql` file with schema definition in current folder
	emitSchemaFile: path.resolve(__dirname, 'schema.generated.gql'),
})

export default class extends ApolloServer {
	public constructor(opts?: { dataSources: () => DataSources<object> }) {
		super({
			schema,
			context: async ({ req, res, connection }) => ({
				req,
				res,
				connection,
				database: await ensureConnection(),
			}),
			dataSources: () => ({}),
			plugins: notProduction
				? [
						ApolloServerPluginInlineTrace(),
						ApolloServerPluginLandingPageLocalDefault(),
				  ]
				: [],
			...opts,
		})
	}
}

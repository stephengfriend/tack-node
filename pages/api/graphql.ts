import ApolloServer from '@tack/graphql'
import { NextApiRequest, NextApiResponse } from 'next'

const apolloServer = new ApolloServer()
const startServer = apolloServer.start()

export default async function graphql(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	res.setHeader('Access-Control-Allow-Credentials', 'true')
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://studio.apollographql.com',
	)
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	)
	if (req.method === 'OPTIONS') {
		res.end()
		return false
	}

	await startServer
	await apolloServer.createHandler({
		path: '/api/graphql',
	})(req, res)
}

export const config = {
	api: {
		bodyParser: false,
	},
}

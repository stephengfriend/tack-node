import { Vessel } from '@tack/entities/vessel.entity'
import { Query, Resolver } from 'type-graphql'

@Resolver((of) => Vessel)
export class VesselResolver {
	@Query((returns) => [Vessel])
	async vessels() {
		return Vessel.find()
	}
}

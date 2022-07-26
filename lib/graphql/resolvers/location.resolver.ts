import { Location } from '@tack/entities/location.entity'
import { Query, Resolver } from 'type-graphql'

@Resolver((of) => Location)
export class LocationResolver {
	@Query((returns) => [Location])
	async locations() {
		return Location.find()
	}
}

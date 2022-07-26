import { Reservation } from '@tack/entities/reservation.entity'
import { Query, Resolver } from 'type-graphql'

@Resolver((of) => Reservation)
export class ReservationResolver {
	@Query((returns) => [Reservation])
	async reservations() {
		return Reservation.find()
	}
}

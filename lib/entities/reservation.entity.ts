import { Field, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
	ViewEntity,
} from 'typeorm'
import { AvailabilityState } from './availability-check.entity'
import { Location } from './location.entity'
import { Vessel } from './vessel.entity'

@ObjectType()
@ViewEntity({
	expression: `SELECT ac."date", ac."availability", ac."locationId", ac."vesselId", ac."created_at" as "updated_at" FROM "availability_check" AS ac LEFT OUTER JOIN "availability_check" AS ac2 ON ac."date" = ac2."date" AND ac."locationId" = ac2."locationId" AND ac."vesselId" = ac2."vesselId" AND (ac."created_at" < ac2."created_at")`,
})
export class Reservation extends BaseEntity {
	@Field()
	@PrimaryColumn({ type: 'date' })
	date!: Date

	@Field(() => Location)
	@JoinColumn({ name: 'locationId' })
	@ManyToOne(() => Location, (location) => location.id, { primary: true })
	location!: Location

	@Field(() => Vessel)
	@JoinColumn({ name: 'vesselId' })
	@ManyToOne(() => Vessel, (vessel) => vessel.id, { primary: true })
	vessel!: Vessel

	@Column({
		type: 'enum',
		enum: AvailabilityState,
		default: AvailabilityState.NONE,
	})
	@Field(() => AvailabilityState)
	availability!: AvailabilityState

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date
}

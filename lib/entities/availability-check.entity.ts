import { registerEnumType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Location } from './location.entity'
import { Vessel } from './vessel.entity'

export enum AvailabilityState {
	NONE = 'none',
	MORNING = 'am',
	EVENING = 'pm',
	ALL_DAY = 'full',
}

registerEnumType(AvailabilityState, {
	name: 'AvailabilityState', // this one is mandatory
	description: 'What, if any, availability does the reservation have?', // this one is optional
})

@Entity()
export class AvailabilityCheck extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'date' })
	date!: Date

	@ManyToOne(() => Location, (location) => location.id)
	@JoinColumn({ name: 'locationId' })
	location!: Location

	@Column()
	locationId!: number

	@ManyToOne(() => Vessel, (vessel) => vessel.id)
	@JoinColumn({ name: 'vesselId' })
	vessel!: Vessel

	@Column()
	vesselId!: number

	@Column({
		type: 'enum',
		enum: AvailabilityState,
		default: AvailabilityState.NONE,
	})
	availability!: AvailabilityState

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date
}

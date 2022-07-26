import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
@ObjectType()
export class Vessel extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn()
	id!: number

	@Column()
	@Field()
	name!: string

	// reservations: [Reservation!] @relation
	// length: Float!
	// manufacturer: String!
	// hull: Hull!
	// engine: Engine! @relation
	// isCenterConsole: Boolean!
	// isInflated: Boolean!

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date
}

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
export class Location extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn()
	id!: number

	@Column()
	@Field()
	name!: string

	@Column({ nullable: true })
	@Field({ nullable: true })
	description?: string

	@Column({ nullable: true })
	@Field({ nullable: true })
	details?: string

	//reservations: [Reservation!] @relation

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date
}

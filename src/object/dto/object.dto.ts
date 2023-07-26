import { EnumObjectStatus, Prisma } from '@prisma/client'
import { ArrayMinSize, IsOptional, IsString } from 'class-validator'

export class ObjectDto implements Prisma.ObjectUpdateInput {
	@IsString()
	title: string

	@IsString()
	status: EnumObjectStatus

	@IsString()
	@IsOptional()
	description: string

	@IsString({ each: true })
	@ArrayMinSize(2)
	geolocation: string[]
}

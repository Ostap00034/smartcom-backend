import { EnumObjectStatus, Prisma } from '@prisma/client'
import { ArrayMinSize, IsOptional, IsString } from 'class-validator'

export class UpdateObjectDto implements Prisma.ObjectUpdateInput {
	@IsString()
	@IsOptional()
	title: string

	@IsString()
	@IsOptional()
	status: EnumObjectStatus

	@IsString()
	@IsOptional()
	description: string

	@IsString({ each: true })
	@ArrayMinSize(2)
	@IsOptional()
	geolocation: string[]
}

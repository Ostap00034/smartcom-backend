import { EnumObjectStatus, Prisma } from '@prisma/client'
import { ArrayMinSize, IsString } from 'class-validator'

export class ObjectDto implements Prisma.ObjectUpdateInput {
	@IsString()
	title: string

	@IsString()
	status: EnumObjectStatus

	@IsString({ each: true })
	@ArrayMinSize(2)
	geolocation: string[]
}

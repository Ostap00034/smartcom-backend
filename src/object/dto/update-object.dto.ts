import { EnumObjectStatus, Prisma, User } from '@prisma/client'
import {
	ArrayMinSize,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class UpdateObjectDto implements Prisma.ObjectUpdateInput {
	@IsString()
	@IsOptional()
	title?: string

	// @IsString()
	@IsOptional()
	status: EnumObjectStatus

	@IsString()
	@IsOptional()
	description?: string

	@IsNumber()
	@IsOptional()
	userId?: number

	@IsString({ each: true })
	@ArrayMinSize(2)
	@IsOptional()
	geolocation?: string[]

	@IsBoolean()
	inRepair?: boolean | Prisma.NullableBoolFieldUpdateOperationsInput
}

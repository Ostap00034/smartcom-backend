import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

enum EnumServicedObjectStatus {
	IN_REPAIR = 'IN_REPAIR',
	FINISHED = 'FINISHED',
}

export class UpdateServicedObjectDto {
	@IsOptional()
	@IsString()
	description: string
	@IsOptional()
	@IsEnum(EnumServicedObjectStatus)
	status: EnumServicedObjectStatus
}

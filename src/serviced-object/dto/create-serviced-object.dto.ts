import { IsNumber, IsString } from 'class-validator'

export class CreateServicedObjectDto {
	@IsString()
	description: string
	@IsNumber()
	userId: number
	@IsNumber()
	objectId: number
}

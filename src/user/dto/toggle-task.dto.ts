import { IsNumber, IsString } from 'class-validator'

export class ToggleTaskDto {
	@IsNumber()
	userId: number

	@IsNumber()
	objectId: number

	@IsString()
	description: string
}

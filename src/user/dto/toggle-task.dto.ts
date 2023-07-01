import { IsString } from 'class-validator'

export class ToggleTaskDto {
	@IsString()
	userId: string

	@IsString()
	objectId: string

	@IsString()
	description: string
}

import { IsString } from 'class-validator'

export class ToggleArchiveDto {
	@IsString()
	description: string
}

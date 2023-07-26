import { IsNotEmpty } from 'class-validator'

export class TakeObjectDto {
	@IsNotEmpty()
	objectId: string | number
}

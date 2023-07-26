import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class UserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	password?: string

  @IsOptional()
	@IsString()
	fio: string

  @IsOptional()
	@IsPhoneNumber('RU')
	phone: string
}

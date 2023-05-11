import { IsEmail, MinLength, IsString, IsPhoneNumber } from 'class-validator'

export class LoginDto {
	@IsEmail()
	email: string

	// @IsPhoneNumber('RU')
	// phone: string

	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов.',
	})
	@IsString()
	password: string
}

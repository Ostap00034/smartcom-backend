import {
	IsEmail,
	MinLength,
	IsString,
	IsPhoneNumber,
	IsEnum,
} from 'class-validator'

enum Roles {
	'MASTER',
	'ADMIN',
}

export class AuthDto {
	@IsEmail()
	email: string
	@IsString()
	fio: string
	@IsEnum(Roles)
	role: Roles
	@IsPhoneNumber('RU')
	phone: string
	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов.',
	})
	@IsString()
	password: string
}

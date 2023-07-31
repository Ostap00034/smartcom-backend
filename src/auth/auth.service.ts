import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/auth.dto'
import { hash, verify } from 'argon2'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { LoginDto } from './dto/login.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private userService: UserService
	) {}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwt.verifyAsync(dto.refreshToken)
		if (!result) throw new UnauthorizedException('Неверный refresh token')

		const user = await this.userService.getById(result.id, {
			role: true,
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		const oldUserByEmail = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (oldUserByEmail)
			throw new BadRequestException('Пользователь с такой почтой существует.')

		const oldUserByPhone = await this.prisma.user.findUnique({
			where: {
				phone: dto.phone,
			},
		})

		if (oldUserByPhone)
			throw new BadRequestException(
				'Пользователь с таким номером телефона существует.'
			)

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				fio: dto.fio,
				phone: dto.phone,
				role: dto.role.toString(),
				objectId: null,
			},
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '6d',
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: Partial<User>) {
		return {
			id: user.id,
			email: user.email,
			role: user.role,
		}
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (!user) throw new NotFoundException('Пользователь не найден.')

		console.log(user)

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Неверный пароль.')

		return user
	}
}

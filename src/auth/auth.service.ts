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

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwt.verifyAsync(dto.refreshToken)
		if (!result) throw new UnauthorizedException('Неверный refresh token')

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id,
			},
		})

		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				contacts: {
					email: dto.email,
					phone: dto.phone,
				},
			},
		})

		if (oldUser) throw new BadRequestException('Пользователь уже существует.')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				fio: dto.fio,
				phone: dto.phone,
				role: dto.role,
			},
		})

		const tokens = await this.issueTokens(user.id, user.role)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	private async issueTokens(userId: number, role: string) {
		const data = { id: userId, role: role }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '6d',
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
		}
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				// contacts: {
				// 	email: dto.email,
				// 	phone: dto.phone,
				// },
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

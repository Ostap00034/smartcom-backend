import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './return-user.object'
import { Prisma } from '@prisma/client'
import { UserDto } from './user.dto'
import { hash } from 'argon2'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				archive: {
					select: {
						id: true,
						items: true,
					},
				},
				...selectObject,
			},
		})

		if (!user) {
			throw new Error('Пользователь не найден')
		}

		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email },
		})

		if (isSameUser && id !== isSameUser.id) {
			throw new BadRequestException('Email занят')
		}

		const user = await this.getById(id)

		return this.prisma.user.update({
			where: {
				id,
			},
			data: {
				email: dto.email,
				fio: dto.fio,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password,
			},
		})
	}

	async toggleArchive(userId: number, objectId: number) {
		const user = await this.getById(userId)

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isExists = user.archive.some(object => object.id === objectId)

		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				archive: {
					[isExists ? 'disconnect' : 'connect']: {
						id: objectId,
					},
				},
			},
		})

		return { message: 'Все прошло успешно' }
	}
}

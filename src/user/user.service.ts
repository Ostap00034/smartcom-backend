import {
	Injectable,
	BadRequestException,
	NotFoundException,
	Inject,
	forwardRef,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './return-user.object'
import { Prisma } from '@prisma/client'
import { UserDto } from './user.dto'
import { hash } from 'argon2'
import { ServicedObjectService } from 'src/serviced-object/serviced-object.service'
import { ObjectService } from 'src/object/object.service'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => ServicedObjectService))
		private servicedObjectService: ServicedObjectService,
		private objectService: ObjectService
	) {}

	async getById(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				servicedObjects: {
					select: {
						id: true,
						description: true,
					},
				},
				...selectObject,
			},
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
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

	async toggleArchive(userId: number, objectId: number, description: string) {
		const user = await this.getById(userId)

		const object = await this.objectService.getById(objectId)

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isExists = await this.prisma.servicedObject.findUnique({
			where: {
				description: description,
			},
		})

		if (isExists)
			throw new BadRequestException('Вы уже обслуживали этот объект')

		const servicedObject = await this.servicedObjectService.create({
			description,
			userId,
			objectId,
		})

		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				servicedObjects: {
					connect: {
						id: servicedObject.id,
						description: description,
					},
				},
			},
		})

		return { message: 'Все прошло успешно' }
	}
}

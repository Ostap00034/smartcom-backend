import { UsersGateway } from '../gateway/users.gateway'
import {
	Injectable,
	BadRequestException,
	NotFoundException,
	Inject,
	forwardRef,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './return-user.object'
import { EnumObjectStatus, Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { ServicedObjectService } from 'src/serviced-object/serviced-object.service'
import { ObjectService } from 'src/object/object.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { servicedObjectReturnObject } from 'src/serviced-object/return-serviced-object.object'
import { ToggleTaskDto } from './dto/toggle-task.dto'
import { UpdateObjectDto } from 'src/object/dto/update-object.dto'
import { ToggleArchiveDto } from './dto/toggle-archive.dto'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => ServicedObjectService))
		private servicedObjectService: ServicedObjectService,
		private objectService: ObjectService,
		private usersGateway: UsersGateway
	) {}

	async getAllMasters() {
		return await this.prisma.user.findMany({
			where: {
				role: 'MASTER',
			},
		})
	}

	async getById(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				servicedObjects: {
					select: servicedObjectReturnObject,
				},
				...selectObject,
			},
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		return user
	}

	async takeObject(userId: number, objectId: number) {
		const object = await this.objectService.getById(+objectId)

		if (object.userId === userId)
			throw new BadRequestException('Вы уже обслуживаете этот объект.')

		if (object.userId)
			throw new BadRequestException('Объект обслуживает другой мастер.')

		await this.objectService.connectUser(userId, +objectId)

		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				object: {
					connect: {
						id: +objectId,
					},
				},
			},
		})

		return { message: 'Удачной работы' }
	}

	async disconnectObject(userId: number, objectId: number) {
		const object = await this.objectService.getById(objectId)

		const user = await this.getById(userId)

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				object: {
					disconnect: {
						id: objectId,
					},
				},
			},
		})
	}

	async startToDo(userId: number, objectId: number) {
		const object = await this.objectService.getById(objectId)

		if (userId !== object.userId)
			throw new BadRequestException('Вы не обслуживаете этот объект.')

		const newDto: UpdateObjectDto = {
			inRepair: true,
			status: 'REPAIR',
		}

		await this.objectService.update(objectId, newDto)

		this.usersGateway.udpateProfile()

		return await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				objectId: objectId,
			},
		})
	}

	async updateProfile(id: number, email: string, dto: UpdateUserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: email },
		})

		if (isSameUser && id !== isSameUser.id) {
			throw new BadRequestException('Email занят')
		}

		const user = await this.getById(id)

		this.usersGateway.udpateProfile()

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

	async toggleArchive(userId: number, objectId: number, dto: ToggleArchiveDto) {
		const object = await this.objectService.getById(objectId)

		const { description } = dto

		const user = await this.getById(userId)

		console.log('userID: ', userId)

		if (userId !== object.userId)
			throw new BadRequestException('Вы не обслуживали этот объект.')

		const servicedObject = await this.servicedObjectService.create({
			description,
			userId,
			objectId,
		})

		const newDto: UpdateObjectDto = {
			status: EnumObjectStatus.NORMAL,
			userId: null,
			description: '',
			inRepair: false,
		}

		await this.objectService.update(objectId, newDto)

		await this.prisma.user.update({
			where: {
				id: +userId,
			},
			data: {
				servicedObjects: {
					connect: {
						id: servicedObject.id,
					},
				},
				object: {
					disconnect: {
						id: objectId,
					},
				},
				objectId: null,
			},
		})

		this.usersGateway.udpateProfile()

		return { message: 'Спасибо за обслуживание.' }
	}

	async toggleTask(dto: ToggleTaskDto) {
		const { userId, objectId, description } = dto

		const object = await this.objectService.getById(+objectId)

		if (userId) {
			const user = await this.getById(+userId)

			if (user.objectId === +objectId)
				throw new BadRequestException(
					'Этот мастер уже обслуживает этот объект.'
				)

			await this.prisma.user.update({
				where: {
					id: +userId,
				},
				data: {
					object: {
						connect: {
							id: +objectId,
						},
					},
				},
			})
		}

		const updateDto = new UpdateObjectDto()
		if (description) updateDto.description = description
		updateDto.status = 'EMERGENCY'

		await this.objectService.update(+objectId, updateDto)

		if (userId) {
			await this.objectService.connectUser(+userId, +objectId)

			this.usersGateway.udpateProfile()
		}

		return { message: 'Работа назначена.' }
	}
}

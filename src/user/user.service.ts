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
import { UserDto } from './dto/user.dto'
import { hash } from 'argon2'
import { ServicedObjectService } from 'src/serviced-object/serviced-object.service'
import { ObjectService } from 'src/object/object.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { TakeObjectDto } from './dto/take-object.dto'
import { servicedObjectReturnObject } from 'src/serviced-object/return-serviced-object.object'
import { ToggleTaskDto } from './dto/toggle-task.dto'
import { UpdateObjectDto } from 'src/object/dto/update-object.dto'

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

		console.log(object)

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
				objectId: +objectId,
			},
		})

		return { message: 'Удачной работы' }
	}

	async updateProfile(id: number, email: string, dto: UpdateUserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: email },
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
		const object = await this.objectService.getById(objectId)

		const user = this.getById(userId)

		if (objectId !== (await user).objectId)
			throw new BadRequestException('Вы не обслуживали этот объект.')

		// Подумать над защитой от спама
		// const isExists = await this.prisma.servicedObject.findUnique({
		// 	where: {
		// 		description: description,
		// 	},
		// })

		// if (isExists)
		// 	throw new BadRequestException('Вы уже обслуживали этот объект')

		const servicedObject = await this.servicedObjectService.create({
			description,
			userId,
			objectId,
		})

		console.log(servicedObject)

		// Подключение объекта к пользователю
		await this.prisma.user.update({
			where: {
				id: userId,
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
			},
		})

		await this.objectService.connectUser(userId, objectId)

		return { message: 'Спасибо за обслуживание.' }
	}

	async toggleTask(dto: ToggleTaskDto) {
		const { userId, objectId, description } = dto

		const object = await this.objectService.getById(objectId)

		const user = await this.getById(userId)

		console.log(user)

		if (objectId === user.objectId)
			throw new BadRequestException('Этот мастер уже обслуживает этот объект.')

		// Подключение объекта к пользователю
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				object: {
					connect: {
						id: objectId,
					},
				},
				objectId: objectId,
			},
		})

		const updateDto = new UpdateObjectDto()
		updateDto.description = description

		await this.objectService.update(objectId, updateDto)

		await this.objectService.connectUser(userId, objectId)

		return { message: 'Работа назначена.' }
	}
}

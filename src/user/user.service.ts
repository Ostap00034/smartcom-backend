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
import { ServicedObjectService } from 'src/serviced-object/serviced-object.service'
import { ObjectService } from 'src/object/object.service'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
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

	async toggleArchive(description: string, userId: number, objectId: number) {
		const user = await this.getById(userId)

		const object = await this.objectService.getById(objectId)

		// return this.servicedObjectService.create({
		// 	description,
		// 	userId,
		// 	objectId,
		// })

		// if (!user) {
		// 	throw new NotFoundException('Пользователь не найден')
		// }

		// console.log(user)

		// const isExists = user.servicedObjects.some(
		// 	ServiceOjbect => ServiceOjbect.id === objectId
		// )

		// await this.prisma.user.update({
		// 	where: {
		// 		id: user.id,
		// 	},
		// 	data: {
		// 		servicedObjects: {
		// 			[isExists ? 'disconnect' : 'connect']: {
		// 				id: objectId,
		// 			},
		// 		},
		// 	},
		// })

		return { message: 'Все прошло успешно' }
	}
}

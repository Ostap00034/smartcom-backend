import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateServicedObjectDto } from './dto/create-serviced-object.dto'
import { UserService } from 'src/user/user.service'
import { ObjectService } from 'src/object/object.service'

@Injectable()
export class ServicedObjectService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
		private objectService: ObjectService
	) {}

	async getAll() {
		return this.prisma.servicedObject.findMany({})
	}

	async create(dto: CreateServicedObjectDto) {
		// const { description, userId, objectId } = dto

		// const user = await this.userService.getById(userId)

		// const object = await this.objectService.getById(objectId)

		// return await this.prisma.servicedObject.create({
		// 	data: {
		// 		description,
		// 		userId,
		// 		objectId,
		// 	},
		// })
		return 'beer'
	}
}

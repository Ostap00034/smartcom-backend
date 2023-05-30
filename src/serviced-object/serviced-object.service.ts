import {
	Injectable,
	Inject,
	forwardRef,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateServicedObjectDto } from './dto/create-serviced-object.dto'
import { UserService } from 'src/user/user.service'
import { ObjectService } from 'src/object/object.service'
import { servicedObjectReturnObject } from './return-serviced-object.object'
import { UpdateServicedObjectDto } from './dto/update-serviced-object.dto'

@Injectable()
export class ServicedObjectService {
	constructor(
		@Inject(forwardRef(() => UserService)) private userService: UserService,
		private prisma: PrismaService,
		private objectService: ObjectService
	) {}

	async getById(id: number) {
		const servicedObject = await this.prisma.servicedObject.findUnique({
			where: {
				id,
			},
			select: servicedObjectReturnObject,
		})

		if (!servicedObject)
			throw new NotFoundException('Обслуженный объект не найден')

		return servicedObject
	}

	async getAll() {
		return this.prisma.servicedObject.findMany({})
	}

	async create(dto: CreateServicedObjectDto) {
		const { description, userId, objectId } = dto

		const user = await this.userService.getById(userId)

		const object = await this.objectService.getById(objectId)

		return await this.prisma.servicedObject.create({
			data: {
				description,
				userId,
				objectId,
			},
		})
	}

	async update(id: number, dto: UpdateServicedObjectDto) {
		const { status, description } = dto

		return this.prisma.servicedObject.update({
			where: {
				id,
			},
			data: {
				description,
				status,
			},
		})
	}
}

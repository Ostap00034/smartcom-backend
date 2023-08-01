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
import {
	EnumObjectSort,
	GetAllServicedObjectDto,
} from './dto/get-all-serviced-object.dto'
import { PaginationService } from 'src/pagination/pagination.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class ServicedObjectService {
	constructor(
		@Inject(forwardRef(() => UserService)) private userService: UserService,
		private prisma: PrismaService,
		private objectService: ObjectService,
		private paginationService: PaginationService
	) {}

	async getById(id: number) {
		const servicedObject = await this.prisma.servicedObject.findUnique({
			where: {
				id,
			},
			select: servicedObjectReturnObject,
		})

		if (!servicedObject) throw new NotFoundException('Объект не найден')

		return servicedObject
	}

	async getAll(dto: GetAllServicedObjectDto) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ServicedObjectOrderByWithRelationInput[] = []

		if (sort === EnumObjectSort.OLDEST) prismaSort.push({ createdAt: 'asc' })
		else prismaSort.push({ createdAt: 'desc' })

		const prismaSearchTermFilter: Prisma.ServicedObjectWhereInput = searchTerm
			? {
					description: {
						contains: searchTerm,
						mode: 'insensitive',
					},
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const servicedObjects = await this.prisma.servicedObject.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
			include: {
				user: true,
				object: true,
			},
		})

		return {
			servicedObjects,
			length: await this.prisma.servicedObject.count({
				where: prismaSearchTermFilter,
			}),
		}
	}

	async getObjectHistory(objectId: number) {
		const object = await this.objectService.getById(objectId)

		return this.prisma.servicedObject.findMany({
			where: {
				object: {
					id: objectId,
				},
			},
			select: {
				...servicedObjectReturnObject,
			},
		})
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
			},
		})
	}
}

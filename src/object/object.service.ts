import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { objectReturnObject } from './return-object.object'
import { ObjectDto } from './dto/object.dto'
import { EnumObjectSort, GetAllObjectDto } from './dto/get-all.object.dto'
import { PaginationService } from 'src/pagination/pagination.service'
import { Prisma } from '@prisma/client'
import { UpdateObjectDto } from './dto/update-object.dto'
import { ObjectsGateway } from 'src/gateway/objects.gateway'

@Injectable()
export class ObjectService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private objectGateway: ObjectsGateway
	) {}

	async getAll(dto: GetAllObjectDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ObjectOrderByWithRelationInput[] = []

		if (sort === EnumObjectSort.OLDEST) prismaSort.push({ createdAt: 'asc' })
		else prismaSort.push({ createdAt: 'desc' })

		const prismaSearchTermFilter: Prisma.ObjectWhereInput = searchTerm
			? {
					title: {
						contains: searchTerm,
						mode: 'insensitive',
					},
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const objects = await this.prisma.object.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
		})

		return {
			objects,
			length: await this.prisma.object.count({
				where: prismaSearchTermFilter,
			}),
		}
	}

	async getAllServicedObjects() {
		const objects = await this.prisma.object.findMany({
			where: {
				status: 'EMERGENCY',
			},
		})

		return objects
	}

	async getById(id: number) {
		const object = await this.prisma.object.findUnique({
			where: {
				id,
			},
			select: objectReturnObject,
		})

		if (!object) throw new NotFoundException('Объект не найден')

		return object
	}

	async create(dto: ObjectDto) {
		const { title, status, description, geolocation } = dto

		const objectByTitle = await this.prisma.object.findUnique({
			where: {
				title,
			},
		})

		const objectByGeolocation = await this.prisma.object.findUnique({
			where: {
				geolocation,
			},
		})

		if (objectByGeolocation || objectByTitle)
			throw new BadRequestException('Объект с таким адресом существует.')

		const newObject = await this.prisma.object.create({
			data: {
				title,
				status,
				description,
				geolocation,
			},
		})

		await this.objectGateway.sendNewObject(newObject)

		return newObject
	}

	async update(id: number, dto: UpdateObjectDto) {
		const object = await this.getById(id)

		return this.prisma.object.update({
			where: {
				id,
			},
			data: dto,
		})
	}

	async connectUser(id: number, objectId: number) {
		return this.prisma.object.update({
			where: {
				id: objectId,
			},
			data: {
				userId: id,
			},
		})
	}

	async delete(id: number) {
		const object = await this.getById(id)
		console.log(object)
		return this.prisma.object.delete({ where: { id } })
	}
}

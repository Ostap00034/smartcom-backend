import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Inject,
	forwardRef,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { objectReturnObject } from './return-object.object'
import { ObjectDto } from './dto/object.dto'
import { EnumObjectSort, GetAllObjectDto } from './dto/get-all.object.dto'
import { PaginationService } from 'src/pagination/pagination.service'
import { Prisma } from '@prisma/client'
import { UpdateObjectDto } from './dto/update-object.dto'
import { ObjectsGateway } from 'src/gateway/objects.gateway'
import { UserService } from 'src/user/user.service'

@Injectable()
export class ObjectService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
		private paginationService: PaginationService,
		private objectGateway: ObjectsGateway
	) {}

	async getAll(dto: GetAllObjectDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ObjectOrderByWithRelationInput[] = []

		if (sort === EnumObjectSort.OLDEST) prismaSort.push({ updatedAt: 'asc' })
		else prismaSort.push({ updatedAt: 'desc' })

		const prismaSearchTermFilter: Prisma.ObjectWhereInput = searchTerm
			? {
					OR: [
						{
							title: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
						{
							user: {
								fio: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
					],
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const objects = await this.prisma.object.findMany({
			where: { ...prismaSearchTermFilter, isServiced: true },
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: objectReturnObject,
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
				isServiced: true,
			},
		})

		return objects
	}

	async getAllNeedServiceObjects() {
		return await this.prisma.object.findMany({
			where: {
				status: 'EMERGENCY',
				isServiced: true,
				userId: null,
			},
		})
	}

	async getById(id: number) {
		const object = await this.prisma.object.findUnique({
			where: {
				id: id,
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

		this.objectGateway.sendCreateObject(newObject)

		return newObject
	}

	async cancel(id: number) {
		const object = await this.getById(id)

		await this.disconnectUser(object.userId, id)

		const updatedObject = await this.prisma.object.update({
			where: { id },
			data: {
				userId: null,
				status: 'NORMAL',
				description: '',
			},
		})

		const newUpdatedObject = {
			...updatedObject,
			user: null,
		}

		this.objectGateway.sendUpdatedObject(newUpdatedObject)

		return updatedObject
	}

	async update(id: number, dto: UpdateObjectDto) {
		const object = await this.getById(id)

		const updatedObject = await this.prisma.object.update({
			where: {
				id,
			},
			data: dto,
			include: {
				user: { select: { fio: true } },
			},
		})

		this.objectGateway.sendUpdatedObject(updatedObject)

		return updatedObject
	}

	async connectUser(id: number, objectId: number) {
		const updatedObject = await this.prisma.object.update({
			where: {
				id: objectId,
			},
			data: {
				userId: id,
				status: 'REPAIR',
			},
			include: {
				user: {
					select: { fio: true },
				},
			},
		})

		this.objectGateway.sendUpdatedObject(updatedObject)

		return updatedObject
	}

	async disconnectUser(userId: number, objectId: number) {
		await this.userService.disconnectObject(userId, objectId)
		return await this.prisma.object.update({
			where: {
				id: objectId,
			},
			data: {
				userId: null,
				inRepair: null,
			},
		})
	}

	async delete(id: number) {
		const object = await this.getById(id)

		if (object.user) await this.disconnectUser(object.userId, id)

		return await this.prisma.object.update({
			where: { id },
			data: {
				isServiced: false,
				inRepair: null,
				userId: null,
				status: 'NORMAL',
			},
		})
	}
}

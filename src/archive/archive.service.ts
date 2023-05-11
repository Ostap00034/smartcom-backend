import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ArchiveService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: number) {
		return this.prisma.archive.findMany({
			where: {
				userId,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}
}

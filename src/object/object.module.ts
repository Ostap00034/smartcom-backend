import { Module } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { PrismaService } from 'src/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
	controllers: [ObjectController],
	providers: [ObjectService, PrismaService, PaginationService],
})
export class ObjectModule {}

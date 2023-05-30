import { Module } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { PrismaService } from 'src/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ServicedObjectModule } from 'src/serviced-object/serviced-object.module'

@Module({
	imports: [ServicedObjectModule],
	controllers: [ObjectController],
	providers: [ObjectService, PrismaService, PaginationService],
	exports: [ObjectService],
})
export class ObjectModule {}

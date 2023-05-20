import { Module } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { PrismaService } from 'src/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ServicedObjectService } from 'src/serviced-object/serviced-object.service'
import { ServicedObjectModule } from 'src/serviced-object/serviced-object.module'

@Module({
	controllers: [ObjectController],
	providers: [
		ObjectService,
		PrismaService,
		PaginationService,
		ServicedObjectService,
	],
	exports: [ObjectService],
})
export class ObjectModule {}

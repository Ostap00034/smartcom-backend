import { Module } from '@nestjs/common'
import { ServicedObjectService } from './serviced-object.service'
import { ServicedObjectController } from './serviced-object.controller'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { ObjectService } from 'src/object/object.service'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
	controllers: [ServicedObjectController],
	providers: [
		ServicedObjectService,
		PrismaService,
		UserService,
		ObjectService,
		PaginationService,
	],
	exports: [ServicedObjectService],
})
export class ServicedObjectModule {}

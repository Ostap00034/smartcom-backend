import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'
import { ServicedObjectService } from 'src/serviced-object/serviced-object.service'
import { ObjectService } from 'src/object/object.service'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		ObjectService,
		PaginationService,
		ServicedObjectService,
	],
	exports: [UserService],
})
export class UserModule {}

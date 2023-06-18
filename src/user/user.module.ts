import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'
import { ObjectService } from 'src/object/object.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ServicedObjectModule } from 'src/serviced-object/serviced-object.module'
import { GatewayModule } from 'src/gateway/gateway.module'
import { ObjectsGateway } from 'src/gateway/objects.gateway'

@Module({
	imports: [forwardRef(() => ServicedObjectModule), GatewayModule],
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		ObjectService,
		PaginationService,
		ObjectsGateway,
	],
	exports: [UserService],
})
export class UserModule {}

import { Module, forwardRef } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { PrismaService } from 'src/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ServicedObjectModule } from 'src/serviced-object/serviced-object.module'
import { GatewayModule } from 'src/gateway/gateway.module'
import { UserService } from 'src/user/user.service'
import { UserModule } from 'src/user/user.module'
import { UsersGateway } from 'src/gateway/users.gateway'

@Module({
	imports: [ServicedObjectModule, GatewayModule, forwardRef(() => UserModule)],
	controllers: [ObjectController],
	providers: [
		ObjectService,
		PrismaService,
		PaginationService,
		UserService,
		UsersGateway,
	],
	exports: [ObjectService],
})
export class ObjectModule {}

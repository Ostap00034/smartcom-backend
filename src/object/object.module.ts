import { Module } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { PrismaService } from 'src/prisma.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ServicedObjectModule } from 'src/serviced-object/serviced-object.module'
import { GatewayModule } from 'src/gateway/gateway.module'
import { ObjectsGateway } from 'src/gateway/objects.gateway'
import { UserService } from 'src/user/user.service'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [ServicedObjectModule, GatewayModule],
	controllers: [ObjectController],
	providers: [ObjectService, PrismaService, PaginationService],
	exports: [ObjectService],
})
export class ObjectModule {}

import { Module } from '@nestjs/common'
import { ObjectsGateway } from './objects.gateway'
import { UsersGateway } from './users.gateway'

@Module({
	providers: [ObjectsGateway, UsersGateway],
	exports: [ObjectsGateway, UsersGateway],
})
export class GatewayModule {}

import { Module } from '@nestjs/common'
import { ObjectsGateway } from './objects.gateway'

@Module({
	providers: [ObjectsGateway],
})
export class GatewayModule {}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { ObjectModule } from './object/object.module'
import { PaginationModule } from './pagination/pagination.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ServicedObjectModule } from './serviced-object/serviced-object.module'
import { GatewayModule } from './gateway/gateway.module'
import { ObjectsGateway } from './gateway/objects.gateway'

@Module({
	controllers: [AppController],
	providers: [AppService, PrismaService, ObjectsGateway],
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ObjectModule,
		PaginationModule,
		JwtModule.register({
			secret: 'sldjf$23jfoilsjfoiesij0(*)',
			signOptions: { expiresIn: '5m' },
		}),
		ServicedObjectModule,
		GatewayModule,
	],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { ObjectModule } from './object/object.module'
import { ArchiveModule } from './archive/archive.module'
import { PaginationModule } from './pagination/pagination.module'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './auth/roles.guard'
import { JwtModule } from '@nestjs/jwt'

@Module({
	controllers: [AppController],
	providers: [
		AppService,
		PrismaService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ObjectModule,
		ArchiveModule,
		PaginationModule,
		JwtModule.register({
			secret: 'sldjf$23jfoilsjfoiesij0(*)',
			signOptions: { expiresIn: '5m' },
		}),
	],
})
export class AppModule {}

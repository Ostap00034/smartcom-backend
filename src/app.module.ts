import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { ObjectModule } from './object/object.module'
import { ArchiveModule } from './archive/archive.module'
import { PaginationModule } from './pagination/pagination.module';

@Module({
	controllers: [AppController],
	providers: [AppService, PrismaService],
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ObjectModule,
		ArchiveModule,
		PaginationModule,
	],
})
export class AppModule {}

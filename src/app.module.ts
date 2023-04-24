import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config'

@Module({
	controllers: [AppController],
	providers: [AppService, PrismaService],
	imports: [ConfigModule.forRoot(), AuthModule],
})
export class AppModule {}

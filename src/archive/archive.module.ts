import { Module } from '@nestjs/common'
import { ArchiveService } from './archive.service'
import { ArchiveController } from './archive.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [ArchiveController],
	providers: [ArchiveService, PrismaService],
})
export class ArchiveModule {}

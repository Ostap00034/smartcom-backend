import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'
import { ObjectService } from 'src/object/object.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { ServicedObjectModule } from 'src/serviced-object/serviced-object.module'

@Module({
	imports: [forwardRef(() => ServicedObjectModule)],
	controllers: [UserController],
	providers: [UserService, PrismaService, ObjectService, PaginationService],
	exports: [UserService],
})
export class UserModule {}

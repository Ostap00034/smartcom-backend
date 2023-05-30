import { Module, forwardRef } from '@nestjs/common'
import { ServicedObjectService } from './serviced-object.service'
import { ServicedObjectController } from './serviced-object.controller'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { ObjectService } from 'src/object/object.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [forwardRef(() => UserModule)],
	controllers: [ServicedObjectController],
	providers: [
		ServicedObjectService,
		PrismaService,
		ObjectService,
		PaginationService,
	],
	exports: [ServicedObjectService],
})
export class ServicedObjectModule {}

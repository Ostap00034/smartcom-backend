import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ServicedObjectService } from './serviced-object.service'
import { CreateServicedObjectDto } from './dto/create-serviced-object.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('servicedobjects')
export class ServicedObjectController {
	constructor(private readonly servicedObjectService: ServicedObjectService) {}

	@Get()
	async getAll() {
		return this.servicedObjectService.getAll()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(@Body() dto: CreateServicedObjectDto) {
		return this.servicedObjectService.create(dto)
	}
}

import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
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

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.servicedObjectService.getById(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(@Body() dto: CreateServicedObjectDto) {
		return this.servicedObjectService.create(dto)
	}

	@Put(':id')
	async update(@Body() dto: CreateServicedObjectDto) {
		// return this.servicedObjectService.update()
	}
}

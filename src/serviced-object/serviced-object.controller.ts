import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ServicedObjectService } from './serviced-object.service'
import { CreateServicedObjectDto } from './dto/create-serviced-object.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UpdateServicedObjectDto } from './dto/update-serviced-object.dto'
import { GetAllServicedObjectDto } from './dto/get-all-serviced-object.dto'

@Controller('servicedobjects')
export class ServicedObjectController {
	constructor(private readonly servicedObjectService: ServicedObjectService) {}

	@Get()
	async getAll(@Query() queryDto: GetAllServicedObjectDto) {
		return this.servicedObjectService.getAll(queryDto)
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
	async update(@Param('id') id: string, @Body() dto: UpdateServicedObjectDto) {
		return this.servicedObjectService.update(+id, dto)
	}
}

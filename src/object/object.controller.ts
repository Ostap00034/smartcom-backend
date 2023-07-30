import {
	Controller,
	Get,
	UsePipes,
	ValidationPipe,
	Query,
	HttpCode,
	Post,
	Put,
	Param,
	Body,
	Delete,
} from '@nestjs/common'
import { ObjectService } from './object.service'
import { GetAllObjectDto } from './dto/get-all.object.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ObjectDto } from './dto/object.dto'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UpdateObjectDto } from './dto/update-object.dto'

@Controller('objects')
export class ObjectController {
	constructor(private readonly objectService: ObjectService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@Auth()
	async getAll(@Query() queryDto: GetAllObjectDto) {
		return this.objectService.getAll(queryDto)
	}

	@Get('/servicedobjects')
	@Auth()
	async getAllServicedObjects() {
		return this.objectService.getAllServicedObjects()
	}

	@Get('/needserviceobjects')
	@Auth()
	async getAllNeedServiceObjects() {
		return this.objectService.getAllNeedServiceObjects()
	}

	@UsePipes(new ValidationPipe())
	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		return this.objectService.getById(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(@Body() dto: ObjectDto) {
		return this.objectService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('/cancel/:id')
	@Auth()
	async cancelObject(@Param('id') id: string) {
		return this.objectService.cancel(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateObject(@Param('id') id: string, @Body() dto: UpdateObjectDto) {
		return this.objectService.update(+id, dto)
	}

	@Put('/connect/:id')
	@Auth()
	async connectUser(@CurrentUser('id') id: number, @Param('id') objectId) {
		return this.objectService.connectUser(id, objectId)
	}

	@Put('/disconnect/:id')
	@Auth()
	async disconnectUser(
		@CurrentUser('id') userId: number,
		@Param('id') objectId
	) {
		return this.objectService.disconnectUser(userId, objectId)
	}

	@HttpCode(200)
	@Delete(':objectId')
	@Auth()
	async deleteObject(@Param('objectId') objectId: string) {
		return this.objectService.delete(+objectId)
	}
}

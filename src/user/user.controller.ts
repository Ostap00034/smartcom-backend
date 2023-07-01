import {
	Controller,
	Get,
	HttpCode,
	Put,
	Body,
	UsePipes,
	ValidationPipe,
	Patch,
	Param,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ToggleArchiveDto } from './dto/toggle-archive.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ToggleTaskDto } from './dto/toggle-task.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth()
	async getAllMasters() {
		return this.userService.getAllMasters()
	}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Patch('/takeObject/:id')
	async takeObject(
		@CurrentUser('id') userId: number,
		@Param('id') objectId: string
	) {
		return this.userService.takeObject(userId, +objectId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('profile')
	async updateProfile(
		@CurrentUser('id') id: number,
		@CurrentUser('email') email: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, email, dto)
	}

	@Auth()
	@Put('starttodo/:objectId')
	async startToDo(
		@CurrentUser('id') userId: number,
		@Param('objectId') objectId: string
	) {
		return this.userService.startToDo(userId, +objectId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Patch('profile/archive/:objectId')
	async toggleArchive(
		@CurrentUser('id') id: number,
		@Param('objectId') objectId: string,
		@Body() dto: ToggleArchiveDto
	) {
		return this.userService.toggleArchive(id, +objectId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Patch('/toggletask')
	async toggleTask(@Body() dto: ToggleTaskDto) {
		return this.userService.toggleTask(dto)
	}
}

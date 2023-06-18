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
import { Role } from 'src/auth/role.enum'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { ToggleArchiveDto } from './dto/toggle-archive.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { TakeObjectDto } from './dto/take-object.dto'
import { ToggleTaskDto } from './dto/toggle-task.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	@Roles(Role.MASTER)
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put()
	async takeObject(@CurrentUser('id') id: number, @Body() dto: TakeObjectDto) {
		return this.userService.takeObject(id, dto)
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

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Patch('profile/archive/:objectId')
	async toggleArchive(
		@CurrentUser('id') id: number,
		@Param('objectId') objectId: string,
		@Body() dto: ToggleArchiveDto
	) {
		const { description } = dto
		return this.userService.toggleArchive(id, +objectId, description)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Patch('/toggletask')
	async toggleTask(@Body() dto: ToggleTaskDto) {
		return this.userService.toggleTask(dto)
	}
}

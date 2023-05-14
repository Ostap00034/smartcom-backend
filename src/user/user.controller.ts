import {
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	Body,
	UsePipes,
	ValidationPipe,
	Patch,
	Param,
	SetMetadata,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './user.dto'
import { Role } from 'src/auth/role.enum'
import { Roles } from 'src/auth/decorators/roles.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	@Roles(Role.ADMIN)
	async getProfile(@CurrentUser('id') id: number) {
		// return this.userService.getById(id)
		return { message: 'BEER' }
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('profile')
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.updateProfile(id, dto)
	}

	@HttpCode(200)
	@Auth()
	@Patch('profile/archive/:objectId')
	async toggleArchive(
		@CurrentUser('id') id: number,
		@Param('objectId') objectId: string
	) {
		return this.userService.toggleArchive(id, +objectId)
	}
}

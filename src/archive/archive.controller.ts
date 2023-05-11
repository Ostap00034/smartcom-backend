import { Controller, Get } from '@nestjs/common'
import { ArchiveService } from './archive.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'

@Controller('archive')
export class ArchiveController {
	constructor(private readonly archiveService: ArchiveService) {}

	@Get()
	@Auth()
	getAll(@CurrentUser('id') userId: number) {
		return this.archiveService.getAll(userId)
	}
}

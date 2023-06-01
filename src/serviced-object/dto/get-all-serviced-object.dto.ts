import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/pagination.dto'

export enum EnumObjectSort {
	NEWEST = 'newest',
	OLDEST = 'oldest',
}

export class GetAllServicedObjectDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumObjectSort)
	sort?: EnumObjectSort

	@IsOptional()
	@IsString()
	searchTerm?: string
}

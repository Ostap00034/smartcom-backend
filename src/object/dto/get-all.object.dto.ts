import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from '../../pagination/pagination.dto'

export enum EnumObjectSort {
	NEWEST = 'newest',
	OLDEST = 'oldest',
}

export class GetAllObjectDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumObjectSort)
	sort?: EnumObjectSort

	@IsOptional()
	@IsString()
	searchTerm?: string
}

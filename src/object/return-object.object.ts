import { Prisma } from '@prisma/client'

export const objectReturnObject: Prisma.ObjectSelect = {
	id: true,
	title: true,
	status: true,
	description: true,
	geolocation: true,
	createdAt: true,
	userId: true,
	user: true,
}

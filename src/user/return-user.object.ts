import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	fio: true,
	role: true,
	phone: true,
	password: false,
}

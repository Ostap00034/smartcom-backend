import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from './role.enum'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector, private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
			context.getHandler(),
			context.getClass(),
		])

		if (!requireRoles) return true

		const request = context.switchToHttp().getRequest()
		const authHeader = request.headers.authorization
		const token = authHeader?.split(' ')[1]

		const user = await this.jwtService.verify(token, {
			secret: 'sldjf$23jfoilsjfoiesij0(*)',
		})

		return requireRoles.some(role => user.role.includes(role))
	}
}

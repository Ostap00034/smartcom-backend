import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
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

		if (!token) {
			throw new UnauthorizedException('JWT токен отсутствует.')
		}

		try {
			const user = this.jwtService.verify(token, {
				secret: 'sldjf$23jfoilsjfoiesij0(*)',
			})

			if (!user.role || !requireRoles.some(role => user.role.includes(role))) {
				throw new UnauthorizedException('Unauthorized')
			}

			return requireRoles.some(role => user.role.includes(role))
		} catch (error) {
			throw new UnauthorizedException('Invalid JWT token')
		}
	}
}

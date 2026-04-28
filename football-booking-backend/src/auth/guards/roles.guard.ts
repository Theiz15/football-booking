import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../common/constants/enums';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
            throw new BusinessException(
                ERROR_CODES.FORBIDDEN,
                'Bạn không có quyền truy cập tài nguyên này'
            );
        }

        return true;
    }
}
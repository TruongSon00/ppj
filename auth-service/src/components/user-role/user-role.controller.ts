import { Controller, Inject } from '@nestjs/common';
import { UserRoleServiceInterface } from './interface/user-role.service.interface';

@Controller('')
export class UserRoleController {
  constructor(
    @Inject('UserRoleServiceInterface')
    private readonly userRoleService: UserRoleServiceInterface,
  ) {}
}

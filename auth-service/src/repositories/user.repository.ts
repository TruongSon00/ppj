import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user/user.entity';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import * as bcryptJs from 'bcryptjs';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    super(usersRepository);
  }

  /**
   * Validate user by password
   * @param username
   * @param password
   * @returns
   */
  public async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id AS id', 'u.password as password'])
      .where('username = :username', { username: username })
      .getRawOne();
    if (!user) return false;

    const isValidPassword = await bcryptJs.compareSync(password, user.password);
    if (!isValidPassword) return false;

    return user;
  }
}

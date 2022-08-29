import { UserService } from '@components/user/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema } from 'src/models/area/area.schema';
import { AreaRepository } from 'src/repository/area/area.repository';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AreaModel', schema: AreaSchema }]),
  ],
  controllers: [AreaController],
  providers: [
    {
      provide: 'AreaRepositoryInterface',
      useClass: AreaRepository,
    },
    {
      provide: 'AreaServiceInterface',
      useClass: AreaService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'AreaRepositoryInterface',
      useClass: AreaRepository,
    },
    {
      provide: 'AreaServiceInterface',
      useClass: AreaService,
    },
  ],
})
export class AreaModule {}

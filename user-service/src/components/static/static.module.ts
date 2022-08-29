import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [StaticController],
  exports: [],
})
export class StaticModule {}

import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { APIPrefix } from './common/common';
import { ConfigService } from '@config/config.service';
import fastifyMultipart from 'fastify-multipart';
import { ExceptionEnterceptor } from '@core/interceptor/exception.interceptor';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fastifyAdapter.register(fastifyMultipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.setGlobalPrefix(APIPrefix.Version);
  let corsOptions = {};
  const configService = new ConfigService();
  if (configService.get('corsOrigin')) {
    corsOptions = {
      origin: new ConfigService().get('corsOrigin'),
    };
  }

  app.register(require('fastify-cors'), corsOptions);

  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionEnterceptor());
  await app.listen(configService.get('port'), '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { APIPrefix } from './common/common';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import { ExceptionEnterceptor } from '@core/interceptors/exception.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: ['error', 'warn', 'log'],
    },
  );

  let corsOptions = {};
  const configService = new ConfigService();
  if (configService.get('corsOrigin')) {
    corsOptions = {
      origin: new ConfigService().get('corsOrigin'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);

  app.setGlobalPrefix(APIPrefix.Version);
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('users')
    .addTag('tasks')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionEnterceptor());

  await app.listen(new ConfigService().get('httpPort'), '0.0.0.0');
}

bootstrap();

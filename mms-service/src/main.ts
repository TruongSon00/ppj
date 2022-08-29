import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { APIPrefix } from './common/index';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import { ExceptionEnterceptor } from '@core/interceptors/exception.interceptor';
import fastifyMultipart from 'fastify-multipart';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { ClusterService } from '@core/cluster/cluster.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    {
      logger:
        process.env.NODE_ENV === 'development'
          ? ['debug', 'error', 'log', 'verbose', 'warn']
          : ['error'],
    },
  );

  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: new ConfigService().get('port'),
      },
    } as TcpOptions,
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
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
  let corsOptions = {};
  const configService = new ConfigService();
  if (configService.get('corsOrigin')) {
    corsOptions = {
      origin: new ConfigService().get('corsOrigin'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);
  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionEnterceptor());

  await app.listen(new ConfigService().get('httpPort'), '0.0.0.0');
}

export const SRC_DIR = __dirname;

process.env.NODE_ENV === 'development'
  ? bootstrap()
  : ClusterService.clusterize(bootstrap);

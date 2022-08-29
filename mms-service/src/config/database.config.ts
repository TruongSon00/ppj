import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoDbConfig = {
  type: 'mongodb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  maxPool: parseInt(process.env.DATABASE_MAX_POOL) || 20,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: process.env.NODE_ENV === 'development',
};

@Injectable()
export default class DatabaseConfigService implements MongooseOptionsFactory {
  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return {
      uri: `mongodb://${mongoDbConfig.username}:${mongoDbConfig.password}@${mongoDbConfig.host}:${mongoDbConfig.port}/${mongoDbConfig.database}?authSource=admin`,
    };
  }
}

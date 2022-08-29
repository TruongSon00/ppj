import { Transport } from '@nestjs/microservices';
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      port: process.env.SERVER_PORT,
      httpPort: process.env.SERVER_HTTP_PORT,
      otpMinNumber: parseInt(process.env.OTP_MIN_NUMBER),
      otpMaxNumber: parseInt(process.env.OTP_MAX_NUMBER),
      otpTimeout: parseInt(process.env.OTP_TIME_OUT),
      saltOrRounds: parseInt(process.env.SALT_OR_ROUNDS),
    };
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.INTERNAL_TOKEN =
      process.env.INTERNAL_TOKEN ||
      't5AQ1il1FtOk6Pp9FEW0VbwYETYqqseisgvo0ZCchayvvsQYFSkNzP7bNZ7vEFr0B1Hd4Ft3KGls1q2Irc20Yv1juslgTgtP4lavfeFiw7qBDDzw5D5Y7vMxoIfkpEqcViZqcPy3K2TCOqzCVGAQjJ4bvmX01xeCqILT5ewBd7fL3hZ4jBlSYmbiIefVIiRzeFhWCYOuVpS4Ng4lPcEBvUorm5zlLAci65UKdKtoXbPtWp2A1jrE5D';

    this.envConfig.warehouseService = {
      options: {
        port: process.env.WAREHOUSE_SERVICE_PORT || 3000,
        host: process.env.WAREHOUSE_SERVICE_HOST || 'warehouse-service',
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

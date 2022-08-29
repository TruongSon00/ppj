export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      port: process.env.SERVER_PORT,
    };
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.corsOrigin = '*';
    if (
      process.env.CORS_ORIGINS &&
      process.env.CORS_ORIGINS.split(',').length > 1
    ) {
      this.envConfig.corsOrigin = process.env.CORS_ORIGINS.split(',');
    }
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

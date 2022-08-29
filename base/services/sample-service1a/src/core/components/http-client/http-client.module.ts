import { HttpClientService } from './http-client.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}

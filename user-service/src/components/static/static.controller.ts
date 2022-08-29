import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as path from 'path';
import { SRC_DIR } from 'src/main';
import { FileStaticRequest } from './dto/file-static.request';
import { FileStaticResponse } from './dto/file-static.response';
import { FILE_NAME_ENUM, FILE_NAME_MAP } from '@constant/import.constant';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nService } from 'nestjs-i18n';

@Controller('static')
export class StaticController {
  constructor(private readonly i18n: I18nService) {}

  private TEMPLATE_PATH = path.join(
    SRC_DIR,
    'static',
    'template',
    `import${path.sep}`,
  );

  @MessagePattern('item-download-file')
  public async downloadFile(@Body() body: FileStaticRequest): Promise<any> {
    const { request } = body;
    const fileStaticResponse = new FileStaticResponse();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');

    if (!FILE_NAME_ENUM[request.fileName]) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.FILE_NOT_EXIST'))
        .build();
    }
    const fileName = FILE_NAME_MAP[request.fileName];
    fileStaticResponse.data = await Buffer.from(
      fs.readFileSync(`${this.TEMPLATE_PATH}${fileName}`, {}),
    );

    return fileStaticResponse;
  }
}

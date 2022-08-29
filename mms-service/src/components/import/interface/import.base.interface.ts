import { ImportRequestDto } from '@components/import/dto/request/import.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { ImportResponseDto } from '@components/import/dto/response/import.response.dto';
import { GetImportTemplateResponseDto } from '@components/import/dto/response/get-import-template.response.dto';

export interface ImportBaseInterface<TResult> {
  import(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto<TResult>>>;
  getImportTemplate(): Promise<ResponsePayload<GetImportTemplateResponseDto>>;
}

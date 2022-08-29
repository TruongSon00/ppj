import { Expose } from 'class-transformer';
import { AttributeType } from 'src/models/attribute-type/attribute-type.model';

export class ListAttributeTypeResponse {
  @Expose()
  data: AttributeType[];

  @Expose()
  count: number;
}

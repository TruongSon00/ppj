import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ListDevicesAppResponseDto } from '@components/device/dto/response/list-devices.app.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: ListDevicesAppResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListDevicesAppResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: '61c035570ac293a034db29fb',
          code: 'GGGGGGGG',
          serial: '61c035570ac293a034db29fb',
          name: 'GGGGGGGGG',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c0360d0ac293a034db29fc',
          code: 'FFFFFFFFFF',
          serial: '61c0360d0ac293a034db29fc',
          name: 'FFFFFFFFFFFFF',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c0347c0ac293a034db29f7',
          code: 'VVVV',
          serial: '61c0347c0ac293a034db29f7',
          name: 'VVVVV',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c034ac0ac293a034db29fa',
          code: 'DDDDDD',
          serial: '61c034ac0ac293a034db29fa',
          name: 'DDDDDDDDDDDDD',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c034900ac293a034db29f8',
          code: 'CCCCC',
          serial: '61c034900ac293a034db29f8',
          name: 'DDDDD',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c0346d0ac293a034db29f6',
          code: 'BBB',
          serial: '61c0346d0ac293a034db29f6',
          name: 'BBB',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c032190ac293a034db29f4',
          code: '12345',
          serial: '61c032190ac293a034db29f4',
          name: 'ABCD1234',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c0247189047625622787fb',
          code: 'string',
          serial: '61c0247189047625622787fb',
          name: 'string',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c034640ac293a034db29f5',
          code: 'AAA',
          serial: '61c034640ac293a034db29f5',
          name: 'AAAA',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
        {
          id: '61c034970ac293a034db29f9',
          code: 'EEEEEE',
          serial: '61c034970ac293a034db29f9',
          name: 'EEEEEE',
          responsibleUser: {
            id: 1,
            username: 'admin',
            fullName: 'Admin',
          },
        },
      ],
      meta: {
        total: 10,
      },
    },
  })
  @Expose()
  data: MetaData;
}

import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DetailWarningResponse } from './detail-warning.response.dto'

export class DetailWarningDataResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
        "_id": "61a78fd462e5bddeb641a683",
        "completeExpectedDate": "2021-07-16T12:36:11.188Z",
        "description": "21212121212",
        "status": 1,
        "type": 3,
        "createdAt": "2021-12-01T15:08:04.496Z",
        "updatedAt": "2021-12-01T15:08:04.496Z",
        "__v": 0,
        "deviceAssignment": {
            "_id": "61a7208f73956f9ce62580c0",
            "code": "string",
            "name": "string",
            "description": 'string',
            "deviceId": "61a7208f73956f9ce62580c0",
            "priority": 'string',
            "createdAt": "2021-12-01T07:13:19.562Z",
            "updatedAt": "2021-12-01T07:13:19.562Z",
            "__v": 0,
        },
        "defect": {
            "_id": "61a7208f73956f9ce62580c0",
            "userId": 1,
            "status": 1,
            "serial": 'string',
            "deviceId": "61a7208f73956f9ce62580c0",
            "factoryId": 1,
            "createdAt": "2021-12-01T07:13:19.562Z",
            "updatedAt": "2021-12-01T07:13:19.562Z",
            "__v": 0,
        },
        "code": "W61a78fd462e5bddeb641a683",
        "user": {
            "id": 41,
            "email": "hue.phamthi123@vti.com.vn",
            "username": "hoang.nguyenminh",
            "fullName": "Nguyễn Minh Hoàng",
        },
        "factory": {
            "id": 20,
            "companyId": 1,
            "name": "     nhà máy    ",
            "code": "0209",
            "description": "a",
            "phone": "aaaaaaaaaaa fgndfgn",
            "location": "     78 Duy Tân     ",
            "status": 0,
            "approverId": null,
            "approvedAt": null,
            "createdAt": "2021-10-04T07:13:26.983Z",
            "updatedAt": "2021-11-18T01:31:13.312Z",
            "deletedAt": null
        },
        "company": {
            "id": 1,
            "name": "VTI SnP",
            "code": "V001",
            "address": "3A Ngõ 82 Duy Tân",
            "phone": "0989123123",
            "taxNo": null,
            "email": "vti@gmail.com",
            "fax": "aasd",
            "description": null,
            "status": 0,
            "createdAt": "2021-07-17T09:27:30.840Z",
            "updatedAt": "2021-10-13T07:06:31.308Z",
            "approver": {}
        }
    }
  })
  @Expose()
  data: DetailWarningResponse;
}

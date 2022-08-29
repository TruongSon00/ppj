import { AuthServiceInterface } from './interface/auth.service.interface';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { MessagePattern } from '@nestjs/microservices';
import {
  Controller,
  Body,
  Inject,
  Post,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginSucessfullyResponseDto } from './dto/response/login-sucessfully-response.dto';

@Controller('')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @MessagePattern('login')
  @Post('/login')
  @ApiOperation({
    tags: ['Auth', 'Login'],
    summary: 'Login',
    description: 'Đăng nhập',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: LoginSucessfullyResponseDto,
  })
  public async getItems(@Body() payload: LoginRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.authService.login(request);
  }

  @Get('/token/validate')
  @MessagePattern('validate_token')
  public async validateToken(@Query() payload: any): Promise<any> {
    return await this.authService.validateToken(payload);
  }

  @Get('/token/refresh')
  @MessagePattern('refresh_token')
  public async refreshToken(@Param() payload: any): Promise<any> {
    return await this.authService.refreshToken(payload);
  }
}

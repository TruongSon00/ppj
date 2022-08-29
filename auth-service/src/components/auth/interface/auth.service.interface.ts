import { ResponsePayload } from '../../../utils/response-payload';
import { LoginRequestDto } from '../dto/request/login-request.dto';
export interface AuthServiceInterface {
  login(payload: LoginRequestDto): Promise<ResponsePayload<any>>;
  validateToken(payload: any): Promise<any>;
  refreshToken(payload: any): Promise<any>;
  _createToken(id: number, code: string, username: string): any;
  _createRefreshToken(id: number, rememberPassword?: number): any;
}

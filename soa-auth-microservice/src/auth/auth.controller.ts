import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'verify' })
  async verifyAuthorizationHeader(authorizationHeader: string): Promise<boolean> {
    const valid = await this.authService.verifyAuthorization(authorizationHeader);
    console.log(`Header is valid: ${valid}`);
    return valid;
  }
}

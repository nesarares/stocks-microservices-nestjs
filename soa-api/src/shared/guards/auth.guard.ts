import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authHeader = (context.switchToHttp().getRequest() as Request).headers.authorization || '';
    const valid = await this.authClient.send({ cmd: 'verify' }, authHeader).toPromise();
    return valid;
  }
}

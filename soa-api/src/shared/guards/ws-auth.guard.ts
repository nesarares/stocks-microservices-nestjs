import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = (context.switchToWs().getClient() as Socket).handshake.query.token;
    const valid = await this.authClient.send({ cmd: 'verify-token' }, token).toPromise();
    return valid;
  }
}

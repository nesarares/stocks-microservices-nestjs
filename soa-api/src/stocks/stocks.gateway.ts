import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { config } from 'src/config';
import { WsAuthGuard } from 'src/shared/guards/ws-auth.guard';

@WebSocketGateway(config.wsPort)
export class StocksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log({ client: client.id, event: 'Client connected' });
  }

  handleDisconnect(client: Socket) {
    console.log({ client: client.id, event: 'Client disconnected' });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: { stock: string }) {
    console.log({ client: client.id, event: 'subscribe', data });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, data: { stock: string }) {
    console.log({ client: client.id, event: 'unsubscribe', data });
  }
}

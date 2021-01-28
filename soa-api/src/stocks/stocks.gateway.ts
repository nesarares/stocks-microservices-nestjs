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
import { RedisService } from 'src/redis/redis.service';
import { WsAuthGuard } from 'src/shared/guards/ws-auth.guard';

interface RedisEvent {
  stock: string;
  value: number;
}

@WebSocketGateway(config.wsPort)
export class StocksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  stockSubscriptions: { [key: string]: Set<Socket> } = {};

  constructor(@Inject('STOCKS_SERVICE') private stocksClient: ClientProxy, private redisService: RedisService) {
    this.redisService.fromEvent<RedisEvent>('stocks').subscribe(({ stock, value }) => {
      const set = this.stockSubscriptions[stock];
      for (const client of set) {
        client.emit('message', { stock, value });
      }
    });
  }

  private logSubscriptions() {
    console.table(
      Object.keys(this.stockSubscriptions).map((key) => ({
        stock: key,
        client: Array.from(this.stockSubscriptions[key]).map((socket) => socket.client.id),
      })),
    );
  }

  async handleConnection(client: Socket) {
    console.log({ client: client.id, event: 'Client connected' });
  }

  handleDisconnect(client: Socket) {
    Object.keys(this.stockSubscriptions).forEach((key) => {
      if (this.stockSubscriptions[key]?.delete(client)) {
        // Unsubscribe from stocks microservice
      }
    });

    this.logSubscriptions();
    console.log({ client: client.id, event: 'Client disconnected' });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, { stock }: { stock: string }) {
    if (!this.stockSubscriptions[stock]) {
      this.stockSubscriptions[stock] = new Set();
    }
    this.stockSubscriptions[stock].add(client);
    // Subscribe to stocks microservice
    this.stocksClient.emit('subscribe-stock', stock);

    this.logSubscriptions();
    console.log({ client: client.id, event: 'subscribe', stock });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, { stock }: { stock: string }) {
    this.stockSubscriptions[stock]?.delete(client);
    // Unsubscribe from stocks microservice
    this.stocksClient.emit('unsubscribe-stock', stock);

    this.logSubscriptions();
    console.log({ client: client.id, event: 'unsubscribe', stock });
  }
}

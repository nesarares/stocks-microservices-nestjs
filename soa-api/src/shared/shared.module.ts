import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: config.authHost,
          port: config.authPort,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedModule {}

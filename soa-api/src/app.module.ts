import { Module } from '@nestjs/common';
import { StocksModule } from './stocks/stocks.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [StocksModule, SharedModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

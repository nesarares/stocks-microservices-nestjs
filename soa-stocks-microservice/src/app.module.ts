import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [StockModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

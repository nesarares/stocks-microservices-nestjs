import { HttpModule, Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  providers: [StockService],
  imports: [HttpModule, RedisModule],
  controllers: [StockController],
})
export class StockModule {}

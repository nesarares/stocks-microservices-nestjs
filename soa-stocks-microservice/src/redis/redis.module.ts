import { Module } from '@nestjs/common';
import * as Redis from 'ioredis';
import { config } from 'src/config';
import { RedisService } from './redis.service';

export type RedisClient = Redis.Redis;

@Module({
	providers: [
		{
			useFactory: (): RedisClient => {
				return new Redis({
					host: config.redisHost,
					port: config.redisPort
				});
			},
			provide: 'REDIS_PUBLISHER'
		},
		RedisService
	],
	exports: [
		RedisService
	]
})
export class RedisModule {}

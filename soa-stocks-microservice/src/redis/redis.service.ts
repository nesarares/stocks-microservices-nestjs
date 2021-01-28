import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.module';

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_PUBLISHER') private redisPublisherClient: RedisClient) {}

	public async publish(channel: string, value: unknown): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			return this.redisPublisherClient.publish(channel, JSON.stringify(value), (error, reply) => {
				if (error) {
					return reject(error); 
				}
 
				return resolve(reply);
			});
		});
	}
}

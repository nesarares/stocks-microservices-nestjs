import { Inject, Injectable } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';
import { RedisClient } from './redis.module';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_SUBSCRIBER') private redisSubscriberClient: RedisClient) {}

  public fromEvent<T>(eventName: string): Observable<T> {
    this.redisSubscriberClient.subscribe(eventName);

    return new Observable((observer: Observer<{ channel: string; message: string }>) =>
      this.redisSubscriberClient.on('message', (channel, message) => observer.next({ channel, message })),
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }
}

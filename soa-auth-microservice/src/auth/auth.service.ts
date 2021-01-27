import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwks from 'jwks-rsa';

@Injectable()
export class AuthService {
  jwksClient: jwks.JwksClient;

  constructor() {
    this.jwksClient = jwks({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://soa-stocks.eu.auth0.com/.well-known/jwks.json',
    });
  }

  private verifyToken(token: string, secretOrPublicKey: string) {
    return new Promise<boolean>((resolve) => {
      jwt.verify(token, secretOrPublicKey, (err) => {
        if (!err) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  public async verifyAuthToken(token: string) {
    const decoded = jwt.decode(token, { complete: true }) as { [key: string]: any };
    const kid = decoded?.header?.kid;

    if (!kid) {
      return false;
    }

    const key = await this.jwksClient.getSigningKeyAsync(kid);
    const signingKey = key.getPublicKey();
    return this.verifyToken(token, signingKey);
  }

  public async verifyAuthorization(authorizationHeader: string) {
    if (!authorizationHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authorizationHeader.slice('Bearer '.length);
    return this.verifyAuthToken(token);
  }
}

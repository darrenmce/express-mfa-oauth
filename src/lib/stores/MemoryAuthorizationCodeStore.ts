import Logger from 'bunyan';
import TokenGenerator from 'uuid-token-generator';
import NodeCache from 'node-cache';

import { AuthCode, AuthCodeConsume, AuthCodeValues, IAuthorizationCodeStore } from './types';

const DEFAULT_TTL_SECONDS = 60 * 60; //1hr

export class MemoryAuthorizationCodeStore implements IAuthorizationCodeStore {
  private codes: NodeCache;
  private readonly tokenGenerator: TokenGenerator;

  constructor(
    private log: Logger,
    authCodeTTLSeconds: number = DEFAULT_TTL_SECONDS
  ) {
    this.codes = new NodeCache({ stdTTL: authCodeTTLSeconds });
    this.tokenGenerator = new TokenGenerator();
  }

  generate(authCodeValues: AuthCodeValues): Promise<AuthCode> {
    const authCode = this.tokenGenerator.generate(128, TokenGenerator.BASE58);
    this.log.info('AuthorizationCodeStore: generating code', { username: authCodeValues.username, authCode });
    this.codes.set(authCode, authCodeValues);
    return Promise.resolve(authCode);
  }

  consume(authCode: AuthCode, { redirectURI }: AuthCodeConsume): Promise<AuthCodeValues> {
    const codeValues = this.codes.get(authCode) as AuthCodeValues;
    if (!codeValues) {
      throw new Error('Invalid Authorization Code');
    }
    if (redirectURI !== codeValues.redirectURI) {
      throw new Error('Invalid Authorization Code');
    }
    this.codes.del(authCode);
    return Promise.resolve(codeValues);
  }

}

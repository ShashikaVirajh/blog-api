import * as bcrypt from 'bcrypt';

import { HashingProvider } from './hashing.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProvider implements HashingProvider {
  /** Hash Password */
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  /** Compare Password */
  public async comparePassword(
    password: string | Buffer,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}

import * as bcrypt from 'bcrypt';

import { HashingService } from './hashing.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService implements HashingService {
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

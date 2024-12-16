import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hashPassword(data: string | Buffer): Promise<string>;

  abstract comparePassword(
    password: string | Buffer,
    encryptedPassword: string,
  ): Promise<boolean>;
}

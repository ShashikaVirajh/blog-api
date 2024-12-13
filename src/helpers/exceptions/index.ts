import { RequestTimeoutException } from '@nestjs/common';

export function DatabaseTimeoutException(description?: string): never {
  throw new RequestTimeoutException('Error connecting to the database.', {
    description: description ?? 'A database operation failed',
  });
}

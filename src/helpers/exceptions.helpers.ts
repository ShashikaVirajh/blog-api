import { ConflictException, RequestTimeoutException } from '@nestjs/common';

export function databaseTimeoutException(description?: string): never {
  throw new RequestTimeoutException('Error connecting to the database', {
    description: description ?? 'A database operation failed',
  });
}

export function failedTransactionException(error?: any): never {
  throw new ConflictException('Could not complete the transaction', {
    description: String(error),
  });
}

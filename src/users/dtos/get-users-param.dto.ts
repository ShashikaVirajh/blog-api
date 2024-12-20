import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Fetch a user with the id',
    example: 12345,
  })
  @IsOptional()
  @IsInt()
  // Transform the string value to number as params and queries are always strings.
  // So auto transformation does not work.
  @Type(() => Number)
  id?: number;
}

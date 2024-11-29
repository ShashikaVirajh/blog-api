import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  // Transform the string value to number as params and queries are always strings.
  // So auto transformation does not work.
  @Type(() => Number)
  id?: number;
}

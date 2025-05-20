import { Expose } from 'class-transformer';

export class DeleteContactResponseDto {
  @Expose()
  message: string;
}

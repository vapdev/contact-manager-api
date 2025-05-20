import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  message: string;

  @Expose()
  userId: string;
}

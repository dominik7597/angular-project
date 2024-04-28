import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @MinLength(8, { message: 'Minimalna długość to 8 znaków.' })
  password: string;
}

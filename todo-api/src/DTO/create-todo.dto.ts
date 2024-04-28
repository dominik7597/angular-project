import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @MaxLength(30, { message: 'Maksymalna długość to 30 znaków.' })
  @MinLength(4, { message: 'Minimalna długość to 4 znaki.' })
  title: string;
  @IsNotEmpty()
  description: string;
}

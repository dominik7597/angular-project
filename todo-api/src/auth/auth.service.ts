import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/DTO/register.dto';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/DTO/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    const hashed = await bcrypt.hash(password, 12);
    const salt = bcrypt.getSalt(hashed);

    const foundUser = await this.repo.findOneBy({ username });

    if (foundUser) {
      throw new BadRequestException('Nazwa użytkownika musi być unikalna.');
    } else {
      const user = new UserEntity();
      user.username = username;
      user.password = hashed;
      user.salt = salt;

      this.repo.create(user);

      try {
        return await this.repo.save(user);
      } catch (err) {
        throw new InternalServerErrorException(
          'Coś poszło nie tak. Użytkownik nie został stworzony.',
        );
      }
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.repo.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatch = await user.verifyPassword(password);

    if (passwordMatch) {
      const jwtPayload = { username };
      const jwtToken = await this.jwt.signAsync(jwtPayload, {
        expiresIn: '30m',
        algorithm: 'HS512',
      });
      return { token: jwtToken };
    } else {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthRepository } from './auth.repository';

// Application 계층: 비즈니스 흐름을 담당하고, 영속화는 AuthRepository 에 위임한다.
@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  create(createAuthDto: CreateAuthDto) {
    return this.authRepository.create(createAuthDto);
  }

  findAll() {
    return this.authRepository.findAll();
  }

  findOne(id: number) {
    return this.authRepository.findOne(id);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return this.authRepository.update(id, updateAuthDto);
  }

  remove(id: number) {
    return this.authRepository.remove(id);
  }
}

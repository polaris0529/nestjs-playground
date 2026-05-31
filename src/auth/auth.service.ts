import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    const auth = this.authRepository.create(createAuthDto);
    return this.authRepository.save(auth);
  }

  findAll() {
    return this.authRepository.find();
  }

  findOne(id: number) {
    return this.authRepository.findOneBy({ id });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    await this.authRepository.update(id, updateAuthDto);
    return this.authRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.authRepository.delete(id);
  }
}
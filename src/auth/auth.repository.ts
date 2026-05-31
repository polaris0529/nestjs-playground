import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';

// Infrastructure 계층: TypeORM Repository 접근을 캡슐화한다.
// Service 는 이 클래스에만 의존하고, ORM 세부사항(엔티티 매니저 등)을 알지 못한다.
@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    const auth = this.repository.create(createAuthDto);
    return this.repository.save(auth);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    await this.repository.update(id, updateAuthDto);
    return this.repository.findOneBy({ id });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}

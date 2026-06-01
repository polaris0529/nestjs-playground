import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';

// Infrastructure 계층: 메뉴의 TypeORM 접근을 캡슐화한다.
@Injectable()
export class MenuRepository {
  constructor(
    @InjectRepository(Menu)
    private readonly repository: Repository<Menu>,
  ) {}

  // 삭제되지 않은 메뉴 목록 (상위 메뉴 SELECTBOX 용)
  findAll() {
    return this.repository.find({
      where: { deleteYn: 'N' },
      order: { sortOrder: 'ASC' },
    });
  }

  // 사이드바 렌더링용: 사용중(Y)·미삭제(N) 메뉴를 정렬 조회
  findActiveOrdered() {
    return this.repository.find({
      where: { useYn: 'Y', deleteYn: 'N' },
      order: { sortOrder: 'ASC' },
    });
  }

  findById(menuId: number) {
    return this.repository.findOneBy({ menuId });
  }

  create(menu: Partial<Menu>) {
    const entity = this.repository.create(menu);
    return this.repository.save(entity);
  }

  async update(menuId: number, partial: Partial<Menu>) {
    await this.repository.update(menuId, partial);
    return this.findById(menuId);
  }

  // 소프트 삭제: delete_yn 플래그만 'Y' 로 전환
  softRemove(menuId: number) {
    return this.repository.update(menuId, { deleteYn: 'Y' });
  }
}

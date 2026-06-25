import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { rethrowDbError } from '../../shared/exceptions/db-error.util';

// 사이드바 렌더링용 트리 노드: 메뉴 엔티티 + 하위 메뉴 배열
export type MenuTreeNode = Menu & { children: MenuTreeNode[] };

// Application 계층: 메뉴 비즈니스 흐름을 담당하고 영속화는 Repository 에 위임한다.
@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  findAll() {
    return this.menuRepository.findAll();
  }

  // 대시보드 통계: 활성 메뉴 수
  count() {
    return this.menuRepository.countActive();
  }

  // 사이드바 공통 함수: 활성 메뉴를 parent_menu_id 기준 트리로 변환해 반환한다.
  // 각 계층은 sort_order 순서를 유지한다(정렬된 평면 목록을 순회하므로 자동 보장).
  async findMenuTree(): Promise<MenuTreeNode[]> {
    const menus = await this.menuRepository.findActiveOrdered();
    return this.buildTree(menus);
  }

  // 평면 메뉴 목록을 트리로 조립한다.
  private buildTree(menus: Menu[]): MenuTreeNode[] {
    const byId = new Map<number, MenuTreeNode>();
    const roots: MenuTreeNode[] = [];

    // bigint 컬럼은 문자열로 반환되므로 Number 로 정규화해 키로 사용
    menus.forEach((menu) => {
      byId.set(Number(menu.menuId), { ...menu, children: [] });
    });

    menus.forEach((menu) => {
      const node = byId.get(Number(menu.menuId))!;
      const parent =
        menu.parentMenuId !== 0 ? byId.get(Number(menu.parentMenuId)) : null;
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async create(dto: CreateMenuDto) {
    // menuLevel 은 상위 메뉴 기준으로 서버에서 계산 (클라이언트 입력 미신뢰)
    let menuLevel = 1;
    if (dto.parentMenuId) {
      const parent = await this.menuRepository.findById(dto.parentMenuId);
      if (!parent) {
        throw new BadRequestException('menu.errors.parent_not_found');
      }
      menuLevel = parent.menuLevel + 1;
    }

    try {
      return await this.menuRepository.create({ ...dto, menuLevel });
    } catch (error) {
      rethrowDbError(error, {
        key: 'menu.errors.menu_code_exists',
        args: { menuCode: dto.menuCode },
      });
    }
  }

  async findOne(id: number) {
    const menu = await this.menuRepository.findById(id);
    if (!menu) throw new NotFoundException('menu.errors.not_found');
    return menu;
  }

  async update(id: number, dto: UpdateMenuDto) {
    await this.findOne(id);
    const patch: Partial<Menu> = { ...dto };

    // 상위 메뉴 변경 시 menuLevel 재계산 (자기참조·존재 검증)
    if (dto.parentMenuId !== undefined) {
      if (dto.parentMenuId === 0) {
        patch.parentMenuId = 0;
        patch.menuLevel = 1;
      } else {
        if (dto.parentMenuId === id) {
          throw new BadRequestException('menu.errors.parent_self');
        }
        const parent = await this.menuRepository.findById(dto.parentMenuId);
        if (!parent) {
          throw new BadRequestException('menu.errors.parent_not_found');
        }
        patch.menuLevel = parent.menuLevel + 1;
      }
    }

    return this.menuRepository.update(id, patch);
  }

  // 소프트 삭제 (delete_yn = 'Y')
  async remove(id: number) {
    await this.findOne(id);
    return this.menuRepository.softRemove(id);
  }
}

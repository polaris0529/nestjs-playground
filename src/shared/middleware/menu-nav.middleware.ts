import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../../menu/menu.service';

// 공통 미들웨어: SSR 페이지 렌더링 전에 메뉴 트리를 res.locals 에 주입한다.
// 컨트롤러마다 메뉴를 넘기지 않고도 모든 뷰의 사이드바 partial 이 menuTree 를 사용할 수 있다.
@Injectable()
export class MenuNavMiddleware implements NestMiddleware {
  constructor(private readonly menuService: MenuService) {}

  async use(_req: Request, res: Response, next: NextFunction): Promise<void> {
    res.locals.menuTree = await this.menuService.findMenuTree();
    next();
  }
}

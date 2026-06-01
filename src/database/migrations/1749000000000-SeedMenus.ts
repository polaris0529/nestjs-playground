import { MigrationInterface, QueryRunner } from 'typeorm';

// 사이드바 메뉴 트리 시드: 앱 기능 / 원격 서버 / 개발 사이트(분류별 폴더)
// parent_menu_id 는 menu_code 서브쿼리로 해석한다(BIGSERIAL id 를 미리 알 수 없으므로).
export class SeedMenus1749000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Level 1: 최상위 폴더 ──────────────────────────────
    await queryRunner.query(`
      INSERT INTO menu (menu_code, menu_name, menu_type, menu_level, sort_order) VALUES
        ('APP',     '앱 기능',     'FOLDER', 1, 1),
        ('REMOTE',  '원격 서버',   'FOLDER', 1, 2),
        ('DEVSITE', '개발 사이트', 'FOLDER', 1, 3)
    `);

    // ── Level 2: 각 폴더의 하위(페이지/링크/하위폴더) ──────
    await queryRunner.query(`
      INSERT INTO menu (parent_menu_id, menu_code, menu_name, menu_url, menu_type, open_type, menu_level, sort_order)
      SELECT p.menu_id, v.menu_code, v.menu_name, v.menu_url, v.menu_type, v.open_type, 2, v.sort_order
      FROM (VALUES
        -- 앱 기능 (내부 페이지)
        ('APP', 'APP_DASH',     '대시보드',          '/',                              'PAGE',   'SELF',  1),
        ('APP', 'APP_ADMIN',    '관리자 대시보드',   '/admin',                         'PAGE',   'SELF',  2),
        ('APP', 'APP_CCG_NEW',  '공통코드 그룹 생성','/admin/common-code-group/new',   'PAGE',   'SELF',  3),
        ('APP', 'APP_CC_NEW',   '공통코드 생성',     '/admin/common-code/new',         'PAGE',   'SELF',  4),
        ('APP', 'APP_MENU_NEW', '메뉴 생성',         '/admin/menu/new',                'PAGE',   'SELF',  5),
        ('APP', 'APP_APIDOC',   'API 문서',          '/api-docs',                      'LINK',   'BLANK', 6),
        -- 원격 서버 (NPM 프록시 호스트 기준 운영 도메인)
        ('REMOTE', 'REMOTE_WORKFLOW',  'WorkFlow (운영)',     'https://polaris9309.store',           'LINK', 'BLANK', 1),
        ('REMOTE', 'REMOTE_SPRING',    'Spring App',          'https://app.polaris9309.store/api',   'LINK', 'BLANK', 2),
        ('REMOTE', 'REMOTE_PORTAINER', 'Portainer',           'https://portainer.polaris9309.store', 'LINK', 'BLANK', 3),
        ('REMOTE', 'REMOTE_NPM',       'Nginx Proxy Manager', 'https://proxy.polaris9309.store',     'LINK', 'BLANK', 4),
        -- 개발 사이트 (분류별 폴더)
        ('DEVSITE', 'DEV_REPO', '저장소',     NULL, 'FOLDER', NULL, 1),
        ('DEVSITE', 'DEV_REF',  '레퍼런스',   NULL, 'FOLDER', NULL, 2),
        ('DEVSITE', 'DEV_TOOL', '도구',       NULL, 'FOLDER', NULL, 3)
      ) AS v(parent_code, menu_code, menu_name, menu_url, menu_type, open_type, sort_order)
      JOIN menu p ON p.menu_code = v.parent_code
    `);

    // ── Level 3: 분류 폴더 하위의 개발 사이트 링크 ─────────
    await queryRunner.query(`
      INSERT INTO menu (parent_menu_id, menu_code, menu_name, menu_url, menu_type, open_type, menu_level, sort_order)
      SELECT p.menu_id, v.menu_code, v.menu_name, v.menu_url, 'LINK', 'BLANK', 3, v.sort_order
      FROM (VALUES
        -- 저장소
        ('DEV_REPO', 'DEV_GITHUB',    'GitHub',            'https://github.com',                              1),
        ('DEV_REPO', 'DEV_REPO_NEST', 'nestjs-playground', 'https://github.com/polaris0529/nestjs-playground', 2),
        -- 레퍼런스
        ('DEV_REF', 'DEV_NESTDOC',   'NestJS 문서',  'https://docs.nestjs.com',         1),
        ('DEV_REF', 'DEV_TYPEORM',   'TypeORM 문서', 'https://typeorm.io',              2),
        ('DEV_REF', 'DEV_SPRINGDOC', 'Spring 문서',  'https://docs.spring.io',          3),
        ('DEV_REF', 'DEV_MDN',       'MDN',          'https://developer.mozilla.org',   4),
        -- 도구
        ('DEV_TOOL', 'DEV_NPM',     'npm',        'https://www.npmjs.com',  1),
        ('DEV_TOOL', 'DEV_DOCKER',  'Docker Hub', 'https://hub.docker.com', 2),
        ('DEV_TOOL', 'DEV_CANIUSE', 'Can I use',  'https://caniuse.com',    3)
      ) AS v(parent_code, menu_code, menu_name, menu_url, sort_order)
      JOIN menu p ON p.menu_code = v.parent_code
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // FK(parent_menu_id) 때문에 하위 레벨부터 삭제한다.
    await queryRunner.query(`
      DELETE FROM menu WHERE menu_code IN (
        'DEV_GITHUB','DEV_REPO_NEST','DEV_NESTDOC','DEV_TYPEORM','DEV_SPRINGDOC',
        'DEV_MDN','DEV_NPM','DEV_DOCKER','DEV_CANIUSE'
      )
    `);
    await queryRunner.query(`
      DELETE FROM menu WHERE menu_code IN (
        'APP_DASH','APP_ADMIN','APP_CCG_NEW','APP_CC_NEW','APP_MENU_NEW','APP_APIDOC',
        'REMOTE_WORKFLOW','REMOTE_SPRING','REMOTE_PORTAINER','REMOTE_NPM','DEV_REPO','DEV_REF','DEV_TOOL'
      )
    `);
    await queryRunner.query(`
      DELETE FROM menu WHERE menu_code IN ('APP','REMOTE','DEVSITE')
    `);
  }
}

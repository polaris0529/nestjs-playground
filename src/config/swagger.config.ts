import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Swagger(OpenAPI) 문서 설정 — /api-docs 경로에 노출.
// main.ts 의 bootstrap 에서 이미 생성된 app 에 적용만 한다(초기화 로직 분리).
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('WorkFlow API')
    .setDescription('WorkFlow 서버 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  /* const options = new DocumentBuilder()
    .setTitle('Im')
    .setVersion('1.0.0')
    .setDescription('一个聊天的后台服务')
    .addBearerAuth()
    .build(); */

  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('/api', app, document);
  await app.listen(process.env.HOST_PORT || 3000);
}
bootstrap();

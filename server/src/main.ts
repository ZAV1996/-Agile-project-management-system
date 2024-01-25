import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
const PORT = process.env.SERVER_PORT || 5000
const ORIGIN = process.env.ORIGIN
async function start() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: ORIGIN,
    credentials: true
  })
  const config = new DocumentBuilder().setTitle("Документация.").setDescription("Документация к REST API ITIL системы.").setVersion('1.0.0').addTag("ITIL").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);
  await app.listen(PORT, () => { console.log(`Server started on PORT=${PORT}`) });
}
start();

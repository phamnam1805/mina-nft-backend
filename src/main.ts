import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Auxo server')
        .setDescription('Server for auxo project')
        .setVersion('0.0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    app.useGlobalPipes(new ValidationPipe({}));
    SwaggerModule.setup('api', app, document);
    await app.listen(4444, '0.0.0.0');
}
bootstrap();

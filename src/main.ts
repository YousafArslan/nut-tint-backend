import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users') // Optional: Add tags for categorizing routes
    .addBearerAuth() // Add authentication if needed
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

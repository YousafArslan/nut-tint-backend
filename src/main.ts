import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtGuard } from './jwt.guard'; // Adjust the path based on where jwt.guard.ts is located

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(app.get(JwtGuard));

  // Global pipe to validate the input
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );
 
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configure Swagger for Bearer Authentication
  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('API endpoints for the application')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // This indicates the format is JWT
    },
    'JWT-auth', // This name will appear in the Swagger UI
  )
  .build();
 

  app.use((req, res, next) => {
    if (req.headers.referer && req.headers.referer.includes('/api')) {
      req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJlbXBsb3llZSIsImlhdCI6MTczNTU0MzA4OSwiZXhwIjoxNzM1NTQ2Njg5fQ.Uf0ZADrVjuMacAGwWgcEdgn7Q9RSwsvbbNSiWpaMIlQ'; // Replace with a valid token
    }
    next();
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

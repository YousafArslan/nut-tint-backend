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
 

  // app.use((req, res, next) => {
  //   if (req.headers.referer && req.headers.referer.includes('/api')) {
  //     req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhYmNAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM5OTQ2MDIwLCJleHAiOjE3Mzk5NDk2MjB9.xakZqmc8GWpPXx9aCISsaOOQNASMDYutT-oUM8rfB6I';
  //   }
  //   next();
  // });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // await app.listen(3000);
  await  app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
}
bootstrap();

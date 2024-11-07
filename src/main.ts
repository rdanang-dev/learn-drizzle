import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { IAppConfig } from './core/configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // Reference: https://github.com/iamolegga/nestjs-pino#expose-stack-trace-and-error-class-in-err-property
  // app.useLogger(app.get(Logger));

  // global interceptor
  // app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );

  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  app.enableCors();

  const config = app.get<ConfigService>(ConfigService);

  const appConfig = config.get<IAppConfig>('appConfig');
  if (!appConfig) {
    throw new Error('App config is missing');
  }
  // if in dev or staging then enable swagger
  if (['DEV', 'STAGING'].indexOf(appConfig.serviceEnv) !== -1) {
    const swaggerConfig = new DocumentBuilder()
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Please login, and insert your JWT token here',
          in: 'header',
        },
        'JwtAuthGuard', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .setTitle('Ommar Backend')
      .setDescription('Ommar Backend API')
      .setVersion('3.0')
      .build();

    const swaggerOptions: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey, methodKey) => methodKey,
    };

    const document = SwaggerModule.createDocument(
      app,
      swaggerConfig,
      swaggerOptions,
    );

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(appConfig.servicePort || 3002);
}

try {
  bootstrap()
    .then(() =>
      console.log('[OK] App listening on port: ', process.env.SERVICE_PORT),
    )
    .then(() =>
      console.log('[OK] App running on environment: ', process.env.SERVICE_ENV),
    )
    .catch((e) => console.log(e));
} catch (error) {
  console.log(error);
}

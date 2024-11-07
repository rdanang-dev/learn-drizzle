import { Global, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { IDbConfig } from '../core/configs/db.config';
import { DrizzleService } from './drizzle.service.';

@Global()
@Module({
  exports: [DrizzleService],
  providers: [
    DrizzleService,
    {
      provide: 'CONNECTION_POOL',
      inject: [ConfigService], // Correct injection for ConfigService
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDbConfig>('dbConfig');

        if (!dbConfig) {
          throw new Error('Database configuration is missing.');
        }

        return new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
        });
      },
    },
  ],
})
export class DrizzleModule {}

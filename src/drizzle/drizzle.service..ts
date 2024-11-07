import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { databaseSchema } from './schema';

@Injectable()
export class DrizzleService {
  private readonly logger = new Logger(DrizzleService.name);
  public db: NodePgDatabase<typeof databaseSchema>;

  constructor(@Inject('CONNECTION_POOL') private readonly pool: Pool) {
    try {
      this.db = drizzle(this.pool, { schema: databaseSchema });
      this.logger.log('Database connected successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      throw error;
    }
  }
}

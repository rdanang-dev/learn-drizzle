import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi.required.string';
import { baseJoiRequiredNumber } from '../utils/joi.required.number';

export interface IDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const dbConfig = registerAs('dbConfig', (): IDbConfig => {
  const values = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  const schema = Joi.object<IDbConfig>({
    host: baseJoiRequiredString('DB_HOST'),
    port: baseJoiRequiredNumber('DB_PORT'),
    user: baseJoiRequiredString('DB_USER'),
    password: baseJoiRequiredString('DB_PASSWORD'),
    database: baseJoiRequiredString('DB_DATABASE'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(`Error validating DB config: ${error.message}`);
  }

  return value;
});

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredNumber } from '../utils/joi.required.number';
import { baseJoiRequiredString } from '../utils/joi.required.string';
import { baseJoiRequiredUrl } from '../utils/joi.required.url';

/**
 * App Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IAppConfig {
  servicePort: number;
  serviceEnv: string;
  jwtSecret: string;
  jwtExpire: number;
  jwtRefreshExpire: number;
  frontendUrl: string;
  backendUrl: string;
}

export const appConfig = registerAs('appConfig', (): IAppConfig => {
  const values = {
    servicePort: process.env.SERVICE_PORT
      ? parseInt(process.env.SERVICE_PORT, 10)
      : 3002,
    serviceEnv: process.env.SERVICE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE_TIME
      ? parseInt(process.env.JWT_EXPIRE_TIME, 10)
      : 0,
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE_TIME
      ? parseInt(process.env.JWT_REFRESH_EXPIRE_TIME, 10)
      : 0,
    frontendUrl: process.env.FRONTEND_URL,
    backendUrl: process.env.BACKEND_URL,
  };

  const schema = Joi.object<IAppConfig>({
    servicePort: baseJoiRequiredNumber('SERVICE_PORT'),
    serviceEnv: Joi.string().required().valid('DEV', 'STAGING', 'PROD'),
    jwtSecret: baseJoiRequiredString('JWT_SECRET'),
    jwtExpire: baseJoiRequiredNumber('JWT_EXPIRE_TIME'),
    jwtRefreshExpire: baseJoiRequiredNumber('JWT_REFRESH_EXPIRE_TIME'),
    frontendUrl: baseJoiRequiredUrl('FRONTEND_URL'),
    backendUrl: baseJoiRequiredUrl('BACKEND_URL'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for App environment : ${error.message}`,
    );
  }

  return value;
});

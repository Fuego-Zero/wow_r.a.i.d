import { extend } from '@yfsdk/web-basic-library';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import mongoose from 'mongoose';

import { CustomContextMethod } from '../typings';
import { DB_URI } from './config';
import { mongoDBConfig } from './config/core';
import adminCheck from './middleware/adminCheck';
import globalErrorHandler from './middleware/globalErrorHandler';
import JWTMiddleware from './middleware/JWTMiddleware';
import logs from './middleware/logs';
import responseHandler from './middleware/responseHandler';
import signatureMiddleware from './middleware/signatureMiddleware';
import router from './routes';

extend();

const app = new Koa<any, CustomContextMethod>();

const { NODE_ENV } = process.env;

const options = NODE_ENV === 'development' ? {} : mongoDBConfig;

// 连接 MongoDB 数据库
mongoose
  .connect(DB_URI, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// 使用中间件
app.use(globalErrorHandler);
app.use(bodyParser());
app.use(logs);
app.use(responseHandler);
app.use(logger());
app.use(JWTMiddleware);
app.use(adminCheck);
app.use(signatureMiddleware);

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

export default app;

import 'reflect-metadata';

import Koa from 'koa';

import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database';
import cors from '@koa/cors';
import errorHandler from '@middleware/errorHandler';
import bodyParser from 'koa-bodyparser';
import routes from './routes';
import serializer from '@middleware/serializer';

const app = new Koa();

app.use(bodyParser());
app.use(errorHandler);
app.use(cors());
app.use(routes.routes()).use(routes.allowedMethods()).use(routes.middleware());

(() => {
  const database = container.get<Database>(TYPES.Database);
  database
    .checkConnection()
    .then(() => {
      console.log('database connected!');
    })
    .catch((error) => console.error(error));
})();

export default app;

import 'reflect-metadata';

import * as Koa from 'koa';

import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database';
import * as cors from '@koa/cors';
import errorHandler from '@middleware/errorHandler';
import * as bodyParser from 'koa-bodyparser';
import routes from './routes';

const app = new Koa();

app.use(bodyParser());
app.use(errorHandler);
app.use(cors());
app.use(routes.routes()).use(routes.allowedMethods()).use(routes.middleware());

(() => {
  const database = container.get<Database>(TYPES.Database);
  database.checkConnection();
})();

export default app;
import * as Router from '@koa/router';

import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import {ReasonPhrases, StatusCodes} from 'http-status-codes';
import AuthenticationController from './authentication/AuthenticationController';

import UserController from './user/UserController';


const router = new Router();

router.get('/healthy-check', ctx => {
  ctx.response.status = StatusCodes.OK;
  ctx.body = ReasonPhrases.OK;
})

// router.get('/institution/:institutionId', (...args) =>
//   institutionController.get(...args),
// );

// router.get('/institution/:institutionId/profit', (...args) =>
//   institutionController.profit(...args),
// );

// router.post('/transaction', (...args) => transactionController.create(...args));


router.patch(
  '/user/update-password',
  async ctx => {
    const userController = container.get<UserController>(TYPES.UserController);
    await userController.updatePassword(ctx);
    ctx.response.status = StatusCodes.NO_CONTENT;
    ctx.body = ReasonPhrases.NO_CONTENT;
  }
);

router.post(
  '/authentication/authenticate',
  async ctx => {
    const authenticationController = container.get<AuthenticationController>(
      TYPES.AuthenticationController
    );
    const result = await authenticationController.authenticate(ctx);
    ctx.response.status = StatusCodes.OK;
    ctx.body = result;
  }
);

export default router;
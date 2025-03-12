import { Middleware } from 'koa';
import koaJwt from 'koa-jwt';

import { BASE_PREFIX, ROUTER_HEALTH, ROUTER_VERSION, secretKey } from '../config';
import { loginPath } from '../routes/login';

const JWTMiddleware: Middleware = koaJwt({ secret: secretKey }).unless({
  path: [loginPath, BASE_PREFIX + ROUTER_HEALTH, BASE_PREFIX + ROUTER_VERSION],
});

export default JWTMiddleware;

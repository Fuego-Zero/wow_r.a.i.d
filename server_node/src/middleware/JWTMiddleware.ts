import { Middleware } from 'koa';
import koaJwt from 'koa-jwt';

import { BASE_PREFIX, ROUTER_HEALTH, ROUTER_VERSION, secretKey } from '../config';
import { loginPath } from '../routes/login';

const JWTMiddleware: Middleware = koaJwt({ secret: secretKey }).unless({
  path: [
    loginPath,
    BASE_PREFIX + ROUTER_HEALTH,
    BASE_PREFIX + ROUTER_VERSION,
    `${BASE_PREFIX}/schedule/published`,
    `${BASE_PREFIX}/common/wcl_rankings`,
    `${BASE_PREFIX}/config/raid_time`,
  ],
});

export default JWTMiddleware;

import Router from 'koa-router';

import packageJson from '../../package.json';
import { BASE_PREFIX, ROUTER_HEALTH, ROUTER_VERSION } from '../config';
import login from './login';
import user from './user';

const router = new Router({ prefix: BASE_PREFIX });

router.get(ROUTER_HEALTH, async (ctx) => ctx.success());
router.get(ROUTER_VERSION, async (ctx) => ctx.success(packageJson.version));

router.use(login.routes());
router.use(user.routes());

export default router;

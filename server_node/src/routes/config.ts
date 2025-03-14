import Router from 'koa-router';

import ConfigController from '../controllers/ConfigController';

const route = new Router({ prefix: '/config' });

route.get('/raid_time', ConfigController.getRaidTime);

export default route;

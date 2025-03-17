import Router from 'koa-router';

import CommonController from '../controllers/CommonController';

const route = new Router({ prefix: '/common' });

route.get('/wcl_rankings', CommonController.getWCLRankings);

export default route;

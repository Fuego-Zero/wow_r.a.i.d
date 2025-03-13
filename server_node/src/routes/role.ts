import Router from 'koa-router';

import RoleController from '../controllers/RoleController';

const route = new Router();

route.post('/bind_role', RoleController.bindRole);
route.post('/unbind_role', RoleController.unBindRole);

export default route;

import Router from 'koa-router';

import RoleController from '../controllers/RoleController';

const route = new Router();

route.post('/bind_role', RoleController.bindRole);
route.post('/unbind_role', RoleController.unBindRole);
route.post('/update_role', RoleController.updateRole);

export default route;

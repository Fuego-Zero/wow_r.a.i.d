import Router from 'koa-router';

import RoleController from '../controllers/RoleController';

const route = new Router({ prefix: '/role' });

route.post('/bind_role', RoleController.bindRole);
route.post('/unbind_role', RoleController.unBindRole);
route.post('/update_role', RoleController.updateRole);
route.get('/get_all_role', RoleController.getAllRole);

export default route;

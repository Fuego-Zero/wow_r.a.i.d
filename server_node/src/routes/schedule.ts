import Router from 'koa-router';

import ScheduleController from '../controllers/ScheduleController';

const route = new Router({ prefix: '/schedule' });

route.get('/now', ScheduleController.getSchedule);
route.post('/save', ScheduleController.saveSchedule);

export default route;

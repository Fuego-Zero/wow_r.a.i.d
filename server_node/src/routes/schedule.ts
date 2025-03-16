import Router from 'koa-router';

import ScheduleController from '../controllers/ScheduleController';

const route = new Router({ prefix: '/schedule' });

route.get('/now', ScheduleController.getSchedule);
route.post('/save', ScheduleController.saveSchedule);
route.get('/published', ScheduleController.getPublished);

export default route;

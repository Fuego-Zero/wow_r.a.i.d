import Router from 'koa-router';

import ScheduleController from '../controllers/ScheduleController';

const route = new Router({ prefix: '/schedule' });

route.get('/now', ScheduleController.getSchedule);
route.post('/save', ScheduleController.saveSchedule);
route.get('/published', ScheduleController.getPublished);
route.post('/publish', ScheduleController.publish);
route.post('/unpublish', ScheduleController.unpublish);

export default route;

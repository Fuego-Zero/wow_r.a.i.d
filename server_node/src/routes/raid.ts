import Router from 'koa-router';

import SignupRecordController from '../controllers/SignupRecordController';

const route = new Router({ prefix: '/raid' });

route.post('/add_record', SignupRecordController.addRecord);

export default route;

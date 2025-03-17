import Router from 'koa-router';

import SignupRecordController from '../controllers/SignupRecordController';

const route = new Router({ prefix: '/raid' });

route.post('/add_record', SignupRecordController.addRecord);
route.post('/del_record', SignupRecordController.delRecord);
route.get('/all_record', SignupRecordController.getAllRecord);
route.post('/batch_add_records', SignupRecordController.batchAddRecords);

export default route;

import Router from 'koa-router';

import GroupInfoController from '../controllers/GroupInfoController';
import SignupRecordController from '../controllers/SignupRecordController';

const route = new Router({ prefix: '/raid' });

route.post('/add_record', SignupRecordController.addRecord);
route.post('/del_record', SignupRecordController.delRecord);
route.get('/all_record', SignupRecordController.getAllRecord);
route.post('/batch_add_records', SignupRecordController.batchAddRecords);
route.get('/get_group_info', GroupInfoController.getGroupInfo);
route.post('/save_group_info', GroupInfoController.saveGroupInfo);

export default route;

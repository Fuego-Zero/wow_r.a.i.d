import Router from 'koa-router';

import UserController from '../controllers/UserController';

const user = new Router();

user.get('/user_info', UserController.getUserInfo);
user.post('/change_password', UserController.changePassword);

export default user;

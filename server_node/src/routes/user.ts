import Router from 'koa-router';

import UserController from '../controllers/UserController';

const user = new Router();

user.get('/user_info', UserController.getUserInfo);
user.post('/change_password', UserController.changePassword);
user.post('/change_userinfo', UserController.changeUserinfo);

export default user;

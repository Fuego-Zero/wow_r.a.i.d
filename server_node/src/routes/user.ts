import Router from 'koa-router';

import UserController from '../controllers/UserController';

const user = new Router();

user.get('/user_info', UserController.getUserInfo);
user.post('/change_password', UserController.changePassword);
user.post('/change_user_info', UserController.changeUserInfo);
user.get('/all_users', UserController.allUsers);
user.post('/reset_password', UserController.resetPassword);

export default user;

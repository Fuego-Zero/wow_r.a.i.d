import Router from 'koa-router';

import UserController from '../controllers/UserController';

const user = new Router();

user.get('/user_info', UserController.getUserInfo);

export default user;

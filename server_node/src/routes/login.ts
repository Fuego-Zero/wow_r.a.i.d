import Router from 'koa-router';

import { BASE_PREFIX } from '../config';
import UserController from '../controllers/UserController';

const login = new Router();

const LOGIN_PATH = '/login';

export const loginPath = `${BASE_PREFIX}${LOGIN_PATH}`;

login.post(LOGIN_PATH, UserController.login);

export default login;

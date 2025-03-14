export const secretKey = '5t0AFEzNXYhVMBCIW76jb6nL2J8ttOI7'; /* cspell: disable-line */

export const signKey = 'OJuYmvBgTpSMK4AvuOAG4vMhtDoJFBzzTsey1oVwqp6pBy804zJOA97890bigWnT';

export const adminKey =
  'om4lyJOQbIZrZfo9nWAD8JWZiS5e7N8TUH2T8SAmfJuElp5Jf48ASsn5YfCCy4FlvDgoQ0s3mm3OJR9u4hkIErSMBtVcF8xEX6evJOA9W8XTM0h4bhtdrd4zBCb02bz1';

export const BASE_PREFIX = '/api_node';
export const ROUTER_HEALTH = '/health';
export const ROUTER_VERSION = '/version';

const PROJECT_NAME = 'wow_raid';
// const MONGODB_URL = process.env.NODE_ENV === 'production' ? 'mongoDB' : '144.34.226.99';
const MONGODB_URL = process.env.NODE_ENV === 'production' ? 'mongoDB' : '127.0.0.1';

export const DB_URI = `mongodb://${MONGODB_URL}:27017/${PROJECT_NAME}`;

FROM node:lts-slim

COPY package*.json /usr/src/app/
COPY .npmrc /usr/src/app/
COPY .next /usr/src/app/.next/
COPY public /usr/src/app/public/

WORKDIR /usr/src/app

RUN npm install --omit=dev

CMD ["npm", "run", "start"]

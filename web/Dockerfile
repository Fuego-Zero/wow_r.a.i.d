FROM node:lts-slim

COPY package*.json /usr/src/app/
COPY .next /usr/src/app/.next/
WORKDIR /usr/src/app
RUN npm install

CMD ["npm", "run", "start"]

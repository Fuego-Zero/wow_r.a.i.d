FROM node:lts-slim

COPY package*.json /usr/src/app/
COPY .npmrc /usr/src/app/
COPY .next /usr/src/app/.next/
WORKDIR /usr/src/app
RUN npm install --omit=dev

CMD ["npm", "run", "start"]

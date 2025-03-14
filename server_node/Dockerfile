FROM node:lts-slim

ENV NODE_ENV=production
ENV SIGN_CHECK_TIME=true
ENV SIGN_CHECK=false
ENV PORT=6541

COPY package*.json /usr/src/app/
COPY .npmrc /usr/src/app/
COPY dist /usr/src/app/dist
WORKDIR /usr/src/app
RUN npm install --omit=dev

CMD ["npm","run","serve"]
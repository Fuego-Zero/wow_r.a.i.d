FROM node:lts-slim

# 设置时区为上海
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 时区环境变量
ENV TZ=Asia/Shanghai

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
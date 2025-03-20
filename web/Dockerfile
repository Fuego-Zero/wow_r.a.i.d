FROM wow_r.a.i.d_web_base_image:latest

# 设置时区为上海
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 时区环境变量
ENV TZ=Asia/Shanghai

COPY package*.json /usr/src/app/
COPY .npmrc /usr/src/app/
COPY .next /usr/src/app/.next/
COPY public /usr/src/app/public/

WORKDIR /usr/src/app

RUN npm install --omit=dev

CMD ["npm", "run", "start"]

FROM wow_r.a.i.d_server_base_image:latest

RUN pip install --no-cache-dir pymongo flask flask-cors requests && \
    apt-get update && apt-get -y install cron

# 设置时区为上海
RUN apt-get update && \
apt-get install -y --no-install-recommends tzdata && \
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
echo "Asia/Shanghai" > /etc/timezone && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

# 时区环境变量
ENV TZ=Asia/Shanghai

COPY app.py /usr/src/app/
COPY auto_wow_allocation.py /usr/src/app/
COPY config.py /usr/src/app/
COPY log_config.py /usr/src/app/
COPY wcl_service.py /usr/src/app/

WORKDIR /usr/src/app

RUN echo "0 3 * * * cd /usr/src/app && python wcl_service.py >> /var/log/cron.log 2>&1" > /etc/cron.d/wcl-cron && \
    chmod 0644 /etc/cron.d/wcl-cron && \
    crontab /etc/cron.d/wcl-cron

RUN echo '#!/bin/bash\ncron\nexec python app.py' > /usr/src/app/start.sh && \
    chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
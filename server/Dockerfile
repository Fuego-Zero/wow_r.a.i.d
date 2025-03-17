FROM python:latest

RUN pip install --no-cache-dir pymongo flask flask-cors && \
    apt-get update && apt-get -y install cron

COPY auto_wow_allocation.py /usr/src/app/
COPY app.py /usr/src/app/
COPY wcl_service.py /usr/src/app/
COPY config.py /usr/src/app/

WORKDIR /usr/src/app

RUN echo "0 3 * * * cd /usr/src/app && python wcl_service.py >> /var/log/cron.log 2>&1" > /etc/cron.d/wcl-cron && \
    chmod 0644 /etc/cron.d/wcl-cron && \
    crontab /etc/cron.d/wcl-cron

RUN echo '#!/bin/bash\ncron\nexec python app.py' > /usr/src/app/start.sh && \
    chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
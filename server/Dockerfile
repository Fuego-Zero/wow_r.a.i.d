FROM python:latest

RUN pip install --no-cache-dir flask loguru openpyxl pandas werkzeug

COPY auto_wow_allocation.py /usr/src/app/
COPY scheduling_app.py /usr/src/app/
COPY route_app.py /usr/src/app/
COPY start_app.py /usr/src/app/

WORKDIR /usr/src/app

CMD ["python", "start_app.py"] 
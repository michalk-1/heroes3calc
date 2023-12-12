# docker build -t heroes3calc
# docker run -p 8000:8000 heroes3calc
FROM node:16.9 as build1

WORKDIR /heroes3calc
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.12-alpine3.19 as build2
COPY requirements.txt .
RUN python -m pip install -U pip \
    && python -m pip install -U setuptools \
    && python -m pip install -r requirements.txt

FROM python:3.12-alpine3.19
COPY --from=build1 /heroes3calc/app /app
COPY --from=build2 /usr/local /usr/local
COPY LICENSE.txt /app/a/
COPY run_prod.sh .
ENV FLASK_APP=app
ENV FLASK_ENV=production
EXPOSE 8000
CMD ["gunicorn", "--workers", "8", "--bind", "0.0.0.0:8000", "app"]

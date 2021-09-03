FROM node:12-alpine

RUN apk add --update --no-cache tar unzip curl \
   && addgroup -g 1001 app \
   && adduser -s /sbin/nologin -u 1001 -G app -D app \
   && mkdir -p /opt/app && \
    chmod g+rwx -R /opt/app

WORKDIR /opt/app

RUN mkdir logs && \
    mkdir uploads

COPY ./package*.json ./
RUN npm install

VOLUME /opt/app/node_modules

COPY ./ .

RUN chown app:app /opt/app -R

USER 1001

EXPOSE 8081

CMD ["sh", "-c", "./node_modules/.bin/pm2-docker start ecosystem.config.js"]

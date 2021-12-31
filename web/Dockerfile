FROM node:12-alpine as build

ENV NODE_ENV=production
ENV API=
ENV GENERATE_SOURCEMAP=false

RUN apk add --update --no-cache tar unzip curl

VOLUME /opt/app/node_modules

WORKDIR /opt/app

COPY ./package*.json ./
COPY ./yarn.lock ./
COPY ./ .
RUN yarn install && yarn build

FROM nginx:alpine


COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /opt/app/build/ /usr/share/nginx/html

RUN addgroup -g 1001 app && \
    adduser -s /sbin/nologin -u 1001 -G root -D app && \
    chgrp -R 0 /usr/share/nginx && \
    chmod -R g=u /usr/share/nginx && \
    chgrp -R 0 /var/cache/nginx && \
    chmod -R g=u /var/cache/nginx && \
    chgrp -R 0 /var/run && \
    chmod -R g=u /var/run

WORKDIR /usr/share/nginx/html

EXPOSE 3000

CMD nginx -g "daemon off;"
FROM alpine:edge

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN echo '@edge http://nl.alpinelinux.org/alpine/edge/main' >> /etc/apk/repositories \
  && apk update && apk upgrade \
  && apk add --no-cache nodejs-lts@edge \
  && npm install \
  && npm uninstall -g npm \
  && rm -rf /tmp/* \
  && rm -rf /root/.npm/
  
EXPOSE 443 80

CMD [ "node", "index.js" ]

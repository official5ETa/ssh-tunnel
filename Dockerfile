FROM node:17.2-slim

WORKDIR /home/node

ENV LOG=false

ENV SSH_PORT=22
ENV SRC_HOST=0.0.0.0
ENV DST_HOST=0.0.0.0

COPY app ./

RUN npm ci           --no-update-notifier \
 && npm prune        --no-update-notifier \
 && npm cache verify --no-update-notifier

ENTRYPOINT ["node", "index.js"]
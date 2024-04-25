FROM node:17.2-slim

WORKDIR /home/node

RUN apt update \
 && apt install -y openssh-server expect \
 && apt clean \
 && rm -rf /var/lib/apt/lists/*

ENV SSH_PORT=22 \
    REVERSE=false

COPY app ./

CMD ["node", "index.js"]
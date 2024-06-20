FROM docker.arvancloud.ir/node:alpine3.20


WORKDIR /app

COPY package*.json .

ARG NODE_ENV

RUN npm install
COPY . .

ENV PORT 3000

EXPOSE ${PORT}

CMD [ "node", "index.js" ]
FROM node:16.14.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY ./src .
COPY .env .

EXPOSE 4000

CMD [ "npm", "run", "start" ]
FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./shared ./shared
COPY ./proof-verification/package*.json ./
RUN npm install

COPY ./proof-verification .

EXPOSE 3002

CMD ["npm", "start"]
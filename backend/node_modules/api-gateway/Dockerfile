FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./shared ./shared
COPY ./api-gateway/package*.json ./
RUN npm install

COPY ./api-gateway .

EXPOSE 3000

CMD ["npm", "start"]
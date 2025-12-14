FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./shared ./shared
COPY ./credential-revocation/package*.json ./
RUN npm install

COPY ./credential-revocation .

EXPOSE 3003

CMD ["npm", "start"]
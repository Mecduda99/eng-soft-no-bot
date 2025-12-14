FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./shared ./shared
COPY ./identity-issuer/package*.json ./
RUN npm install

COPY ./identity-issuer .

EXPOSE 3001

CMD ["npm", "start"]
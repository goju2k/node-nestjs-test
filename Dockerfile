FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
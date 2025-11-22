FROM node:20.11.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm i @types/passport --save
RUN npm i --save @nestjs/passport passport

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD [  "npm", "run", "start:migrate:prod" ]
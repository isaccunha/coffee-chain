FROM node:20.11.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD [  "npm", "run", "start:migrate:prod" ]
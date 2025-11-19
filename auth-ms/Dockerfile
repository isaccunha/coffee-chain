FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3333

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]

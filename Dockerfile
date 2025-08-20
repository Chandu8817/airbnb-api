FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npx prisma generate

RUN npx prisma migrate  

RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]


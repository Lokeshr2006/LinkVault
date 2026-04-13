FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm install --production

COPY prisma ./prisma/
COPY src ./src/

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
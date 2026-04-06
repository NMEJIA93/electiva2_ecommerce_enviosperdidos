FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY swagger.yaml ./
COPY tsconfig.json ./
COPY src ./src

EXPOSE 5000

CMD ["npm", "run", "start:docker"]

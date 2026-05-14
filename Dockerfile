FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY swagger.yaml ./
COPY tsconfig.json ./
COPY src ./src

EXPOSE 5001

CMD ["npm", "run", "start:docker"]

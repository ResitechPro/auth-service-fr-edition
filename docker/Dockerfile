FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY index.js ./
COPY keys ./keys
COPY src ./src

EXPOSE 3001

CMD ["npm", "run", "dev"]

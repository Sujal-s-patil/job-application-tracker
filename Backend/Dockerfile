# Backend Dockerfile (development)
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

# Start with nodemon for hot reload
CMD ["npm", "run" ,"dev"]
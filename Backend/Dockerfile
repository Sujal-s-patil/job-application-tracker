# Backend Dockerfile (development)
FROM node:22-alpine

WORKDIR /app

# Copy package files first (layer caching — only reinstalls on dependency change)
COPY package*.json ./

# Reproducible install from lockfile
RUN npm ci

# Copy application files
COPY . .

# Expose backend port
EXPOSE 8000

# Start with nodemon for hot reload
CMD ["npm", "start"]
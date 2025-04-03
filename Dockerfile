# Base stage for both development and production
FROM node:18-alpine AS base
WORKDIR /app

# Install necessary tools for database connections and build
RUN apk add --no-cache python3 make g++ unixodbc unixodbc-dev sqlite

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
ENV IS_DOCKER=true

# Install all dependencies
RUN npm install

# Copy the application
COPY . .

# Expose the server port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:dev"]

# Production build stage
FROM base AS builder
ENV NODE_ENV=production
ENV IS_DOCKER=true

# Install all dependencies for building
RUN npm ci

# Copy the application
COPY . .
RUN npm install -g @nestjs/cli

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install necessary tools for SQLServer connection in production
RUN apk add --no-cache unixodbc

# Set production environment
ENV NODE_ENV=production
ENV IS_DOCKER=true

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the server port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start:prod"] 
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# FROM node:20 AS builder

# WORKDIR /app

# COPY . .

# RUN npm install

# RUN npm run build

# # Production image
# FROM nginx:alpine

# COPY --from=builder /app/dist /usr/share/nginx/html

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
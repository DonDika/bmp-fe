# dockerfile untuk membungkus aplikasi

# Stage 1: Build dengan Node
# menggunakan base image nodejs
FROM node:20-alpine as builder

# menentukan working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy semua source code ke working directory container
COPY . .

# build project
RUN npm run build


# Stage 2: Serve pakai NGINX
# pull image nginx untuk serve hasil build
FROM nginx:alpine

# copy hasil project yang sudah di-build ke directory nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# copy konfigurasi nginx yang digunakan untuk serve hasil build tadi
COPY nginx.conf /etc/nginx/conf.d/default.conf

# penanda bahwa container ini akan listen di port 3000, 
# kalau be ditentukan di .env, kalo fe ditentukan di nginx nya
EXPOSE 3001
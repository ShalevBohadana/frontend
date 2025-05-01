# frontend/Dockerfile

# 1) Build stage
FROM node:16 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build     # this creates /app/dist

# 2) Serve stage
FROM nginx:alpine
# ▶ note: copying from /app/dist, not /app/build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

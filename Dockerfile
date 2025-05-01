FROM node:16 AS builder
WORKDIR /app

# Only copy package.json (no lockfile) and install:
COPY package.json ./
RUN npm install

# then bring in the rest and build
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

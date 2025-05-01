# ┌────────────────────────────────────────────────────┐
# │ 1) Builder: install deps & build static assets   │
# └────────────────────────────────────────────────────┘
FROM node:16-alpine AS builder
WORKDIR /app

# only copy package manifests, install deps
COPY package*.json ./
RUN npm ci

# copy the rest of your source
COPY . .

# build the production bundle (outputs to dist/)
RUN npm run build


# ┌────────────────────────────────────────────────────┐
# │ 2) Serve: ship only the static “dist” folder      │
# └────────────────────────────────────────────────────┘
FROM nginx:alpine
# remove the default nginx html
RUN rm -rf /usr/share/nginx/html/*

# copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

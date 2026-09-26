FROM node:24-alpine AS builder

# Build the todo-ui application
WORKDIR /app/todo-ui
COPY todo-ui/ .
RUN npm install && npm run build

FROM nginx:latest

# Remove the default NGINX contents
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/todo-ui/index.html /usr/share/nginx/html/
COPY --from=builder /app/todo-ui/dist /usr/share/nginx/html/dist

# Copy configuration file into the container
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
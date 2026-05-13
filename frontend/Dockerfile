# Stage 1: Build
FROM node:20-alpine AS builder

ARG VITE_API_URL=https://be-todo-02250377.onrender.com
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

# Stage 2: Production
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

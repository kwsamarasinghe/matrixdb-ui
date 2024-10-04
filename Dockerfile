FROM node:20-alpine AS builder


ENV NODE_ENV production
WORKDIR /app

COPY ./package.json ./
RUN npm i --save-dev @types/d3
RUN npm i --save-dev @types/react-csv
RUN npm install
COPY . .
RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
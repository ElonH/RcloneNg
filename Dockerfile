FROM node:12-buster as builder
COPY . /src/
WORKDIR /src
RUN npm install && npm run build:prod


FROM nginx
COPY --from=builder /src/dist/RcloneNg /usr/share/nginx/html
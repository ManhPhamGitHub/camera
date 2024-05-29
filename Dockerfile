FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
ENV TZ=Asia/Ho_Chi_Minh
ENTRYPOINT yarn start
EXPOSE 8000
EXPOSE 8090

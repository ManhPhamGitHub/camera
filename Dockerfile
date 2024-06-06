FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
ENV TZ=Asia/Ho_Chi_Minh
ENTRYPOINT npm run typeorm migration:run
ENTRYPOINT npm run start
EXPOSE 3000
EXPOSE 8090

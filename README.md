## CMC DevOps Cloud Server

### How to run

#### Setup mysql for development mode

```shell
docker-compose up -d
```

#### Install dependencies

```shell
yarn install
```

#### Start server for development

```shell
yarn run typeorm:run-migrations
yarn start:dev
```

#### Seed data for database (Only once execution)

```shell
yarn seed:run
```

#### Typeorm Migrations

- Auto generate migration when any entity changed
  ```shell
  yarn typeorm:generate-migration src/db/migrations/<migration_name>
  ```
- Create a migration manually
  ```shell
  yarn typeorm:create-migration src/db/migrations/<migration_name>
  ```
- Apply database changes to DB
  ```shell
  yarn typeorm:run-migrations
  ```
- Revert a migration
  ```shell
  yarn typeorm:revert-migration
  ```

#### Start server

```shell
yarn start
```

### Start RTSP LOCAL

docker run --name camera3 --rm -it -d \
-e MTX_PROTOCOLS=tcp \
-p 8557:8554 \
bluenviron/mediamtx:latest-ffmpeg

### SEND DATA RECORD TO RTSP LOCAL

ffmpeg -re -stream_loop -1 -i ./src/assets/21.mp4 -c copy -f rtsp rtsp://localhost:8555/mystream
ffmpeg -re -stream_loop -1 -i ./src/assets/22.mp4 -c copy -f rtsp rtsp://localhost:8556/mystream
ffmpeg -re -stream_loop -1 -i ./src/assets/23.mp4 -c copy -f rtsp rtsp://localhost:8557/mystream

pm2 start npm --name "cam-service" -- run "start:dev"

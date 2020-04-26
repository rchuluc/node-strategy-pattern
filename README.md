# node-strategy-pattern

NodeJS strategy design pattern for multidatabase projects

## Database

### Postgres (Docker)

To create Docker image of Postgres run:

```shell
docker run \
    --name postgres \
    -e POSTGRES_PASSWORD=admin \
    -e POSTGRES_USER=admin \
    -e POSTGRES_DB=postgres \
    -p 5432:5432 \
    -d \
    postgres
```

In order to use a client for Postgres run:

```shell
docker run \
    --name pgAdmin \
    --link postgres \
    -p 5050:80 \
    -e 'PGADMIN_DEFAULT_EMAIL=admin' \
    -e 'PGADMIN_DEFAULT_PASSWORD=admin' \
    -d \
    dpage/pgadmin4
```

- The conection Host is the name of docker container running postgres, in this case the name is postgres

### MongoDB (Docker)

To create a MongoDB using Docker run:

```shell
docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin \
    -d \
    mongo:4
```

to use a client (MongoClient)

```shell
docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient
```

- The conection url is mongodb:27017

then create a user in MongoDB

```shell
docker exec -it mongodb \
    mongo --host localhost -u admin -p admin --authenticationDatabase admin \
    --eval "db.getSiblingDB('heroes').createUser({user: 'user', pwd: 'pass', roles: [{role: 'readWrite', db: 'heroes'}]})"
```

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

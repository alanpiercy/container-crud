# container-crud
Client/server app to manage containers

Tech: Docker, GraphQL, Material, NodeJS, ReactJS, Typescript

## Features

* [Dockerode Remote API](https://www.npmjs.com/package/dockerode)
* [Apollo GraphQL Server](https://www.npmjs.com/package/apollo-server)

## Dev setup
### Prereqs

* docker, yarn
* docker test images:
    - [node-hello](https://github.com/alanpiercy/node-hello)
    - or modify web app with choice of images

### Server

```sh
cd server
yarn install
npx tsc
node dist/server
```

### Client

```sh
cd client
yarn install
yarn start
```

## TODO

* Choose from multiple Docker servers
* Discover local docker images
# BACKEND APP pagamento

backend do serviço de pagamento para cliente final `ABC`

## O que vamos user

- [Nodejs](https://nodejs.org/en)
- [fastify](https://fastify.dev/)
- [zod](https://zod.dev/)
- [typescript](https://www.typescriptlang.org/)
- [tsx](https://www.npmjs.com/package/tsx)
- [tsup](https://www.npmjs.com/package/tsup)
- [sequelize](https://sequelize.org/docs/v6/getting-started/)

### Iniciar

Ambiente producao

```bash
yarn start
```

Ambiente dev

```bash
yarn dev
```

Ambiente build

```bash
yarn build
```

### DOCKER

A image que foi usada é uma imagem que foi feita pelo `Tiago Henrique` e esta no repositio hospedado do doker [image](https://hub.docker.com/r/lironnick/nfc.backend)

- Dockerfile
- .dockerignore
- docker-compose.yml

### DEPLOY

O deploy é feito na AWS mas uma parte do build é realizado no `github` pelo `actions`, e para esse processo ser realizado é necessario a
configuração no projeto, as configurações estão na pasta `github/workflows/ci.yml`

`IMPORTANTE:` para funcionar o action é necessario configurar o USUÁRIO e TOKEN da imagem no `secrets and variables` `DOCKERHUB_TOKEN` e `DOCKERHUB_USERNAME`

```bash
.github
    |__ workflows
        |__ ci.yml
```

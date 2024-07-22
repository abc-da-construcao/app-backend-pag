FROM node:20 AS base

RUN npm i -g yarn --force
RUN yarn --version

FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

FROM base AS build

WORKDIR /usr/src/app

COPY . . 
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN yarn build
# RUN yarn prune --prod

FROM node:lts-alpine3.19 AS deploy

WORKDIR /usr/src/app

RUN npm i -g yarn --force

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json


EXPOSE 3333

CMD ["yarn", "start"]
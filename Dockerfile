FROM mhart/alpine-node:10 as base
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn --production
COPY . /app
RUN yarn build

FROM mhart/alpine-node:base-10
WORKDIR /app
ENV NODE_ENV="production"
COPY --from=base /app /app
CMD ["node", "-r", "esm", "./src/server"]

FROM node:16 as builder

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . .

RUN cd client && npm install
RUN npm install
RUN npm run build
RUN rm -rf client

FROM node:16
ENV NODE_ENV=production

COPY --from=builder /home/node/app /home/node/app
RUN chown -R node:node /home/node/app

USER node
WORKDIR /home/node/app

EXPOSE 8080
CMD ["node", "bin/www"]

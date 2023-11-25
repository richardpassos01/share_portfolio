# build
FROM node:20-alpine as build
WORKDIR /app
ADD . /app
RUN chown -R node:node /app
RUN npm install
RUN npm run compile
USER node

# run
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/build /app
COPY --from=build /app/node_modules /app/node_modules
RUN npm install -g pm2

WORKDIR /app

COPY --from=build /app/src/docker-entrypoint.sh /app/
COPY --from=build /app/src/startup-web.sh /app/
COPY --from=build /app/src/startup-web-local.sh /app/
COPY --from=build /app/src/wait-for-db.sh /app/
COPY --from=build /app/src/wait-for-it.sh /app/

RUN chmod +x /app/docker-entrypoint.sh
RUN chmod +x /app/startup-web.sh
RUN chmod +x /app/startup-web-local.sh
RUN chmod +x /app/wait-for-db.sh
RUN chmod +x /app/wait-for-it.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["web-local"]

EXPOSE 4000

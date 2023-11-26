# Stage 1: Build
FROM node:20-slim as build

ENV SRC_PATH /share-portfolio-backend

WORKDIR ${SRC_PATH}

COPY . .

RUN npm install
RUN npm install -g pm2
RUN npm run compile

# Stage 2: Run
FROM node:20-slim

ENV SRC_PATH /share-portfolio-backend

WORKDIR ${SRC_PATH}

COPY --from=build /share-portfolio-backend/node_modules /share-portfolio-backend/node_modules
COPY --from=build /share-portfolio-backend/src/docker-entrypoint.sh /share-portfolio-backend/docker-entrypoint.sh
COPY --from=build /share-portfolio-backend/src/startup-web-local.sh /share-portfolio-backend/startup-web-local.sh
COPY --from=build /share-portfolio-backend/src/wait-for-db.sh /share-portfolio-backend/wait-for-db.sh
COPY --from=build /share-portfolio-backend/src/wait-for-it.sh /share-portfolio-backend/wait-for-it.sh
COPY --from=build /share-portfolio-backend/dist /share-portfolio-backend

RUN chmod +x /share-portfolio-backend/docker-entrypoint.sh
RUN chmod +x /share-portfolio-backend/startup-web-local.sh
RUN chmod +x /share-portfolio-backend/wait-for-db.sh
RUN chmod +x /share-portfolio-backend/wait-for-it.sh

ENTRYPOINT ["/share-portfolio-backend/docker-entrypoint.sh"]

CMD ["web"]

EXPOSE 4000

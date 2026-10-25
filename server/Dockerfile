FROM node:24-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production DATABASE_PATH=/data/timekeeper.db
VOLUME /data
EXPOSE 8787
USER node
CMD ["node", "src/index.ts"]

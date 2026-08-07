# Runs the already-built Astro SSR output. There is no Astro source available
# (see MIGRATION.md) so this image installs production deps and runs dist/
# as-is - it does not (and cannot) rebuild the site from source.
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY dist ./dist

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]

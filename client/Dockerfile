# ── Client – React / Vite dev server ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer cache-friendly)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 5173

# vite.config.js already sets host: "0.0.0.0" so the dev server is reachable
# from outside the container.
CMD ["npm", "run", "dev"]

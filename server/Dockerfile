# ── Server – Node.js + Puppeteer/Chromium ───────────────────────────────────
# Using bookworm-slim so we can install the Debian-packaged Chromium which
# satisfies all shared-library dependencies required by Puppeteer.
FROM node:20-bookworm-slim

# Install Chromium and its system dependencies for Puppeteer PDF export
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-freefont-ttf \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to skip its bundled Chromium download and use system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Install dependencies first (layer cache-friendly)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source (no .env – credentials are injected by docker-compose)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]

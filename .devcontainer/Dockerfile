FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

ENV CHROME_BIN=/usr/bin/chromium \
    BROWSER=/usr/bin/chromium \
    NEXT_PUBLIC_USE_MOCK=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      chromium \
      chromium-driver \
      fonts-noto-color-emoji \
      libasound2 \
      libatk-bridge2.0-0 \
      libgtk-3-0 \
      libnss3 \
      libxss1 \
    && rm -rf /var/lib/apt/lists/*

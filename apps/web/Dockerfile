# syntax=docker/dockerfile:1.4

###################
### Build stage ###
###################

FROM node:20 AS build-stage

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update

RUN npm i -g npm@latest; \
    npm i -g pnpm@latest; \
    SHELL=bash pnpm setup; \
    mkdir -p /usr/local/share/pnpm &&\
    export PNPM_HOME="/usr/local/share/pnpm" &&\
    export PATH="$PNPM_HOME:$PATH"; \
    pnpm bin -g

# Print Node.js & npm versions
RUN node --version
RUN npm --version
RUN pnpm --version

# Install the dependencies
WORKDIR /usr/src/app

COPY --link .git ./.git

COPY --link package*.json ./
COPY --link pnpm*.yaml ./
COPY --link turbo.json ./

COPY --link ./apps ./apps
COPY --link ./submodules ./submodules

RUN git config --global --add safe.directory /usr/src/app
RUN --mount=type=cache,target=/usr/local/share/pnpm pnpm install

# eb-pancake-frontend submodule
WORKDIR /usr/src/app/submodules/eb-pancake-frontend
RUN --mount=type=cache,target=/usr/local/share/pnpm pnpm install

# Define build env. variables based on arguments
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_SITE24X7_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_WEB3MODAL_API_KEY

# Build the project
WORKDIR /usr/src/app
RUN --mount=type=cache,target=/usr/src/app/.turbo/cache --mount=type=cache,target=/usr/src/app/apps/web/.next/cache NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV NEXT_PUBLIC_SITE24X7_KEY=$NEXT_PUBLIC_SITE24X7_KEY NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN NEXT_PUBLIC_WEB3MODAL_API_KEY=$NEXT_PUBLIC_WEB3MODAL_API_KEY pnpm run build

#####################
### Runtime stage ###
#####################

FROM node:20-slim AS runtime-stage

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update && apt-get --no-install-recommends install -y git curl procps htop net-tools dnsutils dumb-init

RUN npm i -g npm@latest

# Print Node.js & npm versions
RUN node --version
RUN npm --version

# Copy the required files from the build step
WORKDIR /usr/src/app

COPY --from=build-stage --link /usr/src/app/apps/web ./apps/web
COPY --from=build-stage --link /usr/src/app/node_modules ./node_modules

# Enable APM Insight Node.js Agent
RUN mkdir -p /usr/src/app/apminsightdata && chown -R node:node /usr/src/app/apminsightdata

# Enable logging
RUN mkdir -p /var/log/nodejs && touch /var/log/nodejs/nodejs.log && chown -R node:node /var/log/nodejs

# Harden Image
COPY --link ./harden.sh .
RUN chmod +x harden.sh && \
    sh harden.sh && \
    rm -f harden.sh

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/bin/bash", "-c", "exec npm run --prefix /usr/src/app/apps/web start-web >> /var/log/nodejs/nodejs.log 2>&1"]

# Force container to run as a non-root user
USER node

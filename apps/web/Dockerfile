# syntax=docker/dockerfile:1.4

ARG NODE_VERSION=20

################
### Updates ###
################

FROM node:${NODE_VERSION} AS updates

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,id=apt,target=/var/cache/apt apt-get update

############
### Base ###
############

FROM updates AS base

# Setup npm and turbo on the base
RUN npm i npm turbo --global

# Setup pnmp on the base
RUN corepack enable
RUN pnpm config set store-dir /root/.pnpm-store

# Print versions
RUN node --version
RUN npm --version
RUN pnpm --version

###############
### Pruner ###
###############

FROM base AS pruner

# Set working directory
WORKDIR /usr/src/app

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune eb-frontend --docker

# Fetch git submodules
RUN git submodule update --init --recursive

###############
### Builder ###
###############

FROM base AS builder

# Set working directory
WORKDIR /usr/src/app
 
# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /usr/src/app/submodules/ ./submodules

# eb-web
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store pnpm install

# eb-pancake-frontend submodule
WORKDIR /usr/src/app/submodules/eb-pancake-frontend
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store pnpm install
 
# Build the project
WORKDIR /usr/src/app
# Copy source code of isolated subworkspace
COPY --from=pruner /usr/src/app/out/full/ .

# Define build env. variables based on arguments

# GENERAL env.
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_SITE24X7_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_WEB3MODAL_API_KEY
ARG NEXT_FORCE_EDGE_IMAGES
ARG NEXT_PUBLIC_TRANSAK_ENV

# TURBO env.
ARG TURBO_API
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG TURBO_REMOTE_ONLY
ARG TURBO_REMOTE_CACHE_TIMEOUT
ARG TURBO_RUN_SUMMARY

# BUILD
RUN NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV NEXT_PUBLIC_SITE24X7_KEY=$NEXT_PUBLIC_SITE24X7_KEY NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN NEXT_PUBLIC_WEB3MODAL_API_KEY=$NEXT_PUBLIC_WEB3MODAL_API_KEY NEXT_FORCE_EDGE_IMAGES=$NEXT_FORCE_EDGE_IMAGES NEXT_PUBLIC_TRANSAK_ENV=$NEXT_PUBLIC_TRANSAK_ENV TURBO_API=$TURBO_API TURBO_TEAM=$TURBO_TEAM TURBO_TOKEN=$TURBO_TOKEN TURBO_REMOTE_ONLY=$TURBO_REMOTE_ONLY TURBO_REMOTE_CACHE_TIMEOUT=$TURBO_REMOTE_CACHE_TIMEOUT TURBO_RUN_SUMMARY=$TURBO_RUN_SUMMARY pnpm run build-docker

##############
### Runner ###
##############

FROM node:${NODE_VERSION}-slim AS runner

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,id=apt,target=/var/cache/apt apt-get update && apt-get --no-install-recommends install -y git curl procps htop net-tools dnsutils dumb-init netcat-openbsd

RUN npm i -g npm@latest

# Copy the required files from the build step
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/apps/web ./apps/web
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Enable APM Insight Node.js Agent
RUN mkdir -p /usr/src/app/apminsightdata && chown -R node:node /usr/src/app/apminsightdata

# Enable logging
RUN mkdir -p /var/log/nodejs && touch /var/log/nodejs/nodejs.log && chown -R node:node /var/log/nodejs

# Harden Image
COPY ./harden.sh .
RUN chmod +x harden.sh && \
    sh harden.sh && \
    rm -f harden.sh

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/bin/bash", "-c", "exec npm run --prefix /usr/src/app/apps/web start-web >> /var/log/nodejs/nodejs.log 2>&1"]

# Force container to run as a non-root user
USER node
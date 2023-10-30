# syntax=docker/dockerfile:1.4

###################
### Deps stage ###
###################

FROM node:18 AS deps-stage

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update

RUN npm install -g npm@latest

# Print Node.js & npm versions
RUN node --version
RUN npm --version

# Install the dependencies
WORKDIR /usr/src/app

COPY --link package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit dev

###################
### Build stage ###
###################

FROM node:18 AS build-stage

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update

RUN npm install -g npm@latest

# Print Node.js & npm versions
RUN node --version
RUN npm --version

# Install the dependencies
WORKDIR /usr/src/app

COPY --from=deps-stage --link /usr/src/app/node_modules ./node_modules
COPY --link package.json ./
COPY --link .husky ./.husky
COPY --link pages ./pages
COPY --link public ./public
COPY --link src ./src
COPY --link types ./types
COPY --link next.config.js ./
COPY --link jsconfig.json ./
COPY --link tsconfig.json ./
COPY --link sentry.client.config.ts ./
COPY --link sentry.edge.config.ts ./
COPY --link sentry.server.config.ts ./

# Define build env. variables based on arguments
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_SITE24X7_KEY
ARG NEXT_PUBLIC_SENTRY_DSN

# Build the project
RUN --mount=type=cache,target=/usr/src/app/.next/cache NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV NEXT_PUBLIC_SITE24X7_KEY=$NEXT_PUBLIC_SITE24X7_KEY NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN npm run build

#####################
### Runtime stage ###
#####################

FROM node:18-slim AS runtime-stage

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update && apt-get --no-install-recommends install -y git curl procps htop net-tools dnsutils dumb-init

RUN npm install -g npm@latest

# Print Node.js & npm versions
RUN node --version
RUN npm --version

# Copy the required files from the build step
WORKDIR /usr/src/app

COPY --from=build-stage --link /usr/src/app/.husky ./.husky
COPY --from=build-stage --link /usr/src/app/pages ./pages
COPY --from=build-stage --link /usr/src/app/public ./public
COPY --from=build-stage --link /usr/src/app/src ./src
COPY --from=build-stage --link /usr/src/app/types ./types
COPY --from=build-stage --link /usr/src/app/next.config.js ./

COPY --from=build-stage --link /usr/src/app/package*.json ./
COPY --from=build-stage --link /usr/src/app/.next ./.next
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
CMD ["/bin/bash", "-c", "exec npm run start-web >> /var/log/nodejs/nodejs.log 2>&1"]

# Force container to run as a non-root user
USER node

# syntax=docker/dockerfile:1.4

FROM node:20 AS base

###############
### Builder ###
###############

FROM base AS builder

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update

# Set working directory
WORKDIR /usr/src/app

RUN npm i -g npm@latest; \
    npm i -g turbo@latest;

# Print versions
RUN node --version
RUN npm --version

COPY . .

# Fetch submodule(s)
RUN git submodule update --init --recursive
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune eb-frontend --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

#################
### Installer ###
#################

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update

RUN npm i -g npm@latest; \
    npm i -g pnpm@latest;

# Print versions
RUN node --version
RUN npm --version
RUN pnpm --version

# Set working directory
WORKDIR /usr/src/app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /usr/src/app/out/json/ .
COPY --from=builder /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN rm -rf ./submodules
COPY ./submodules ./submodules
# eb-web
RUN pnpm install
# eb-pancake-frontend submodule
WORKDIR /usr/src/app/submodules/eb-pancake-frontend
RUN pnpm install
 
# Build the project
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/out/full/ .

# Define build env. variables based on arguments
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_SITE24X7_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_WEB3MODAL_API_KEY

RUN NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV NEXT_PUBLIC_SITE24X7_KEY=$NEXT_PUBLIC_SITE24X7_KEY NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN NEXT_PUBLIC_WEB3MODAL_API_KEY=$NEXT_PUBLIC_WEB3MODAL_API_KEY pnpm run build-docker

##############
### Runner ###
##############

FROM base AS runner

# Immediately stop execution if any of the commands return a non-zero exit code aka stop builds at first command failure
RUN set -e

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update && apt-get --no-install-recommends install -y git curl procps htop net-tools dnsutils dumb-init

RUN npm i -g npm@latest

# Print versions
RUN node --version
RUN npm --version

# Copy the required files from the build step
WORKDIR /usr/src/app

COPY --from=installer /usr/src/app/apps/web ./apps/web
COPY --from=installer /usr/src/app/node_modules ./node_modules

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
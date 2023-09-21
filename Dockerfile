# syntax=docker/dockerfile:1.4

#####################
### Runtime image ###
#####################

FROM node:18-slim AS runtime-image

# Allow to cache package downloads (BuildKit cache mount)
RUN rm -f /etc/apt/apt.conf.d/docker-clean
# Update/install packages
RUN --mount=type=cache,target=/var/cache/apt apt-get update && apt-get --no-install-recommends install -y git curl procps htop net-tools dnsutils dumb-init

RUN npm install -g npm@latest

# Print Node.js & npm versions
RUN node --version
RUN npm --version

# Copy the required files
WORKDIR /usr/src/app

COPY --link .husky ./.husky
COPY --link pages ./pages
COPY --link public ./public
COPY --link src ./src
COPY --link next.config.js ./

COPY --link package*.json ./
COPY --link .next ./.next
COPY --link node_modules ./node_modules

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

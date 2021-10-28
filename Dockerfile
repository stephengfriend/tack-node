ARG TAG=14-alpine
ARG NODE_ENV=production

# Install dependencies only when needed
FROM node:${TAG} AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

RUN apk add --no-cache libc6-compat

WORKDIR /home/node/tack

COPY ./package.json ./package-lock.json /home/node/tack/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS build

COPY . .
RUN npm run build && npm ci --production --ignore-scripts --prefer-offline --no-audit

FROM node:${TAG} AS dev

# Development Toolss
# zsh-vcs is required for vcs_info function definition on alpine
# RUN echo "@community https://dl-cdn.alpinelinux.org/alpine/v3.12/community" >> /etc/apk/repositories
RUN apk add --upgrade --no-cache curl git openssh-client sudo zsh zsh-vcs

WORKDIR /home/node/tack

COPY --from=base --chown=node:node /home/node/tack/node_modules ./node_modules
COPY --from=base --chown=node:node /root/.npm ../.npm

USER node
ENV NODE_ENV=${NODE_ENV}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "dev"]

# Production image, copy all the files and run next
FROM node:${TAG} AS run

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /home/node/tack/next.config.js ./
COPY --from=build --chown=node:node /home/node/tack/public ./public
COPY --from=build --chown=node:node /home/node/tack/.next ./.next
COPY --from=build --chown=node:node /home/node/tack/node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/tack/package.json ./package.json

USER node
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]

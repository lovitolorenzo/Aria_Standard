# syntax=docker/dockerfile:1

##
# Base image: Node with necessary build tools
##
FROM node:18-bullseye AS base

# Install dependencies for Foundry
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        build-essential \
        libssl-dev \
        git \
        && rm -rf /var/lib/apt/lists/*

# Install Foundry properly with environment setup
RUN curl -L https://foundry.paradigm.xyz | bash && \
    /root/.foundry/bin/foundryup

# Add foundry to PATH
ENV PATH="/root/.foundry/bin:${PATH}"

# Verify forge installation
RUN forge --version

WORKDIR /app

# Copy source code for both Foundry and React
COPY . /app

# Install Node dependencies
RUN cd frontend && npm install

# Build Foundry
RUN forge build

# Build the frontend
RUN cd frontend && npm run build

##
# Production image
##
FROM node:18-bullseye AS production

# Install dependencies and Foundry in production
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        build-essential \
        libssl-dev \
        git \
        && rm -rf /var/lib/apt/lists/* && \
    curl -L https://foundry.paradigm.xyz | bash && \
    /root/.foundry/bin/foundryup

ENV PATH="/root/.foundry/bin:${PATH}"

WORKDIR /app

# Copy built artifacts from the previous stage
COPY --from=base /app/frontend/dist ./frontend/dist
COPY --from=base /app/out ./out
COPY --from=base /app/foundry.toml .
COPY --from=base /app/lib ./lib
COPY --from=base /app/script ./script
COPY --from=base /app/test ./test
COPY --from=base /app/contracts ./contracts

# Install serve
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "frontend/dist"]
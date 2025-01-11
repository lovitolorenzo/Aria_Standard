# syntax=docker/dockerfile:1

FROM node:18-bullseye

# Install basic development tools
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    build-essential \
    libssl-dev \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install Foundry
RUN curl -L https://foundry.paradigm.xyz | bash && \
    /root/.foundry/bin/foundryup

# Add foundry to PATH
ENV PATH="/root/.foundry/bin:${PATH}"

# Create app directory and set permissions
WORKDIR /app

# Switch to non-root user for better security
USER node

# We'll handle the rest through dev container lifecycle
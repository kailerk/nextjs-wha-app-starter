---
name: docker-prod-deploy
description: >
  Complete Docker production deployment workflow: build Docker image,
  stop/remove old containers, run new container with production env file,
  verify deployment success. Triggers on: "deploy to production",
  "docker deploy", "build and run docker", "deploy with docker",
  or any request to containerize and run this Next.js app.
---

# Docker Production Deployment Guide

## Prerequisites

- Docker installed and running
- `.env.production` file exists with all required env vars
- Dockerfile in project root (multi-stage: deps → builder → runner)

## Required Env Variables in `.env.production`

```
DATABASE_URL=mysql://user:password@host:3306/database
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://your-domain
```

## Complete Deployment Workflow

### Step 1: Build Docker Image

```bash
docker build -t nextjs-wha-app:1.0.0 .
```

**What happens:**
- Stage 1 (deps): Install npm dependencies
- Stage 2 (builder): Compile Next.js, generate Prisma client
- Stage 3 (runner): Minimal production image with nodejs user

### Step 2: Stop & Remove Old Container (Optional but Safe)

```bash
# Stop running container
docker stop my-nextjs-wha-app

# Remove old container
docker rm my-nextjs-wha-app

# Remove old image (optional)
docker rmi nextjs-wha-app:1.0.0
```

### Step 3: Run New Container

```bash
docker run \
  --restart=always \
  -d \
  --name my-nextjs-wha-app \
  --env-file .env.production \
  -p 4000:3000 \
  nextjs-wha-app:1.0.0
```

**Flags explained:**
- `--restart=always` — auto-restart if container crashes
- `-d` — run in background
- `--name my-nextjs-wha-app` — container name (use to stop/restart)
- `--env-file .env.production` — load all env vars from file
- `-p 4000:3000` — map port 4000 (host) → 3000 (container)

### Step 4: Verify Deployment

```bash
# Check container is running
docker ps | grep my-nextjs-wha-app

# View logs
docker logs -f my-nextjs-wha-app

# Test endpoint (after ~10s startup)
curl http://localhost:4000
```

## One-Line Deployment (Build + Run)

```bash
docker build -t nextjs-wha-app:1.0.0 . && \
docker stop my-nextjs-wha-app 2>/dev/null || true && \
docker rm my-nextjs-wha-app 2>/dev/null || true && \
docker run \
  --restart=always \
  -d \
  --name my-nextjs-wha-app \
  --env-file .env.production \
  -p 4000:3000 \
  nextjs-wha-app:1.0.0 && \
docker logs -f my-nextjs-wha-app
```

## Docker Compose Alternative (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.9'

services:
  nextjs-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: my-nextjs-wha-app
    restart: always
    ports:
      - "4000:3000"
    env_file:
      - .env.production
    environment:
      PORT: 3000
      HOSTNAME: "0.0.0.0"
```

Then deploy:

```bash
docker compose up -d --build
docker compose logs -f
```

## Common Commands

```bash
# View all containers
docker ps -a

# View running containers only
docker ps

# See logs (follow)
docker logs -f my-nextjs-wha-app

# Restart container
docker restart my-nextjs-wha-app

# Stop container
docker stop my-nextjs-wha-app

# Remove stopped container
docker rm my-nextjs-wha-app

# Remove image
docker rmi nextjs-wha-app:1.0.0

# SSH into running container
docker exec -it my-nextjs-wha-app sh

# Copy file from container
docker cp my-nextjs-wha-app:/app/file.txt ./
```

## Troubleshooting

### Container exits immediately
```bash
docker logs my-nextjs-wha-app
# Check: DATABASE_URL is correct, BETTER_AUTH_SECRET set,
# Database server is reachable from container (use host.docker.internal or network)
```

### Port 4000 already in use
```bash
# Change port mapping: -p 8080:3000 instead of -p 4000:3000
docker run ... -p 8080:3000 ...

# Or find & kill process using port
lsof -i :4000
kill -9 <PID>
```

### Build fails at Prisma generation
```bash
# Dockerfile sets DATABASE_URL=mysql:build:build@localhost:3306/build
# This is for build-time only (no real DB needed). If it fails, check:
# 1. Prisma schema is valid
# 2. No Prisma client code runs at build time
```

### Env vars not loaded in container
```bash
# Verify .env.production exists
ls -l .env.production

# Check env vars in running container
docker exec my-nextjs-wha-app sh -c 'env | grep DATABASE'

# If missing, vars weren't in .env.production file
```

## Production Checklist

- ✅ `.env.production` has all required vars
- ✅ `DATABASE_URL` points to production DB
- ✅ `BETTER_AUTH_SECRET` is strong & kept secret
- ✅ `BETTER_AUTH_URL` matches production domain
- ✅ Port 4000 (or chosen port) is open to clients
- ✅ Database server is reachable from container host
- ✅ `--restart=always` is set for auto-recovery
- ✅ Logs are monitored/rotated (see Docker daemon config)
- ✅ Container runs as non-root user `nextjs` (built into Dockerfile)

## Version Management

Tag images by date or release:

```bash
docker build -t nextjs-wha-app:2024-06-11 .
docker build -t nextjs-wha-app:v1.2.3 .
docker build -t nextjs-wha-app:latest .

# Keep old images for quick rollback
docker run ... nextjs-wha-app:2024-06-10
```

## Network Modes

If using Docker Compose or linking containers:

```bash
# Default bridge network
docker run ... my-nextjs-wha-app:1.0.0

# Connect to specific network
docker network create app-network
docker run --network app-network ... my-nextjs-wha-app:1.0.0

# Access other containers by service name
# e.g., DATABASE_URL=mysql://user:pass@db:3306/db
```

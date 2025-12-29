# Chatterbox Docker Deployment

## Build the Docker image

```bash
cd chatterbox-service
docker build -t chatterbox-tts .
```

## Run the container

### CPU Mode
```bash
docker run -d \
  --name chatterbox \
  -p 5002:5002 \
  -e CHATTERBOX_MODEL=turbo \
  chatterbox-tts
```

### GPU Mode (NVIDIA)
```bash
docker run -d \
  --name chatterbox \
  --gpus all \
  -p 5002:5002 \
  -e CHATTERBOX_MODEL=turbo \
  chatterbox-tts
```

## Verify it's running

```bash
# Check container status
docker ps | grep chatterbox

# Check logs
docker logs chatterbox

# Test health endpoint
curl http://localhost:5002/health
```

## Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  chatterbox:
    build: ./chatterbox-service
    container_name: chatterbox-tts
    ports:
      - "5002:5002"
    environment:
      - CHATTERBOX_MODEL=turbo
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5002/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Then run:

```bash
docker-compose up -d
```

## Stop and remove

```bash
docker stop chatterbox
docker rm chatterbox
```

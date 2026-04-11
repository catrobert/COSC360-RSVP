# COSC360 RSVP

## Run With Docker (TA/Grading Setup)

From the project root (`cosc360-rsvp`), run:

```bash
docker compose down -v
docker compose up --build
```

After startup:

- App (frontend): `http://localhost:4000`
- Backend API: `http://localhost:3001`
- MongoDB: `localhost:27017`

This setup uses Docker Compose service networking:

- Backend connects to Mongo via `mongodb://mongo:27017/cosc360-rsvp`
- Frontend proxies API calls to `http://backend:3000`

## Docker Debug Mode (Live Reload)

Use the debug compose override to run both services in development mode with file watching:

```bash
docker compose -f docker-compose.yaml -f docker-compose.debug.yaml up --build -d
```


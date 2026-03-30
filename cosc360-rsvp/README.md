# COSC360 RSVP

## Docker Debug Mode (Live Reload)

Use the debug compose override to run both services in development mode with file watching.

```bash
docker compose -f docker-compose.yaml -f docker-compose.debug.yaml up --build
```

What this gives you:

- Frontend Vite HMR updates in place when you edit client code.
- Backend restarts automatically on server file changes using Node watch mode.
- Node inspector exposed on `9229` for backend debugging.

You no longer need to run compose down/up for normal code edits.

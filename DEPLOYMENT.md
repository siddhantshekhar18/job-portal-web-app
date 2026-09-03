# Deployment guide

## Netlify + Render deployment

This repository includes `netlify.toml` and `render.yaml` for the split deployment:

1. Create a Render PostgreSQL database, then deploy the `render.yaml` blueprint.
2. Set `CORS_ORIGIN` on Render to the exact Netlify site URL, for example `https://easyjobs.netlify.app`.
3. In Netlify, set the site base directory to `frontend` if it is not read from `netlify.toml`.
4. Set the Netlify environment variable `VITE_API_URL` to the Render service URL followed by `/api`, for example `https://easyjobs-api.onrender.com/api`.
5. Trigger a new Netlify deploy after setting `VITE_API_URL`; Vite embeds it at build time.

The Render health check is `/api/health`. The first Render start runs database migrations before starting the API.

## Same-origin Docker deployment

Build and run the included Docker image. It serves the React application and API from one origin, so no production Vite proxy is required.

```bash
docker build -t easyjobs .
docker run --env-file backend/.env -p 3000:3000 -v easyjobs_uploads:/app/backend/uploads easyjobs
```

Set these production values in your host's secret manager, not in Git:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` — use a long, randomly generated value
- `DB_SSL=true` for managed PostgreSQL services that require TLS
- `TRUST_PROXY=true` when deployed behind a platform proxy
- `CORS_ORIGIN` only when hosting the frontend separately; otherwise leave it empty

Run migrations before serving traffic. The Docker command does this automatically; use `npm run migrate` for a non-Docker deployment.

## Health check

Configure the hosting provider's health check as:

```
/api/health
```

## Resume storage

The current application stores resumes on disk. Mount a persistent volume at `/app/backend/uploads` as shown above. For serverless or multi-instance deployments, replace local uploads with object storage before launch.

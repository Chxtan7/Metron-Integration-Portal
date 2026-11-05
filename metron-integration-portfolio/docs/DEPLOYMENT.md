# Deployment

The application is deployed as two services: a static Vite frontend on Vercel and a read-only JSON catalog API on Render.

## Render API

1. Push this repository to GitHub.
2. In Render, create a Blueprint from the repository. Render reads `render.yaml` and creates the `metron-catalog-api` web service.
3. Wait for the service to become healthy, then verify `https://<render-service>.onrender.com/catalog` returns the catalog JSON.

The deployed API only accepts `GET` and `HEAD` requests. Its catalog is a demo data source and is not connected to production Metron systems.

## Vercel frontend

1. Import the same GitHub repository into Vercel, using the repository root as the project root.
2. Vercel uses `vercel.json` to build with `npm run build` and publish `dist`.
3. In the Vercel project settings, add `VITE_API_BASE_URL` with the Render service's base URL, for example `https://metron-catalog-api.onrender.com` (no trailing slash).
4. Redeploy after setting the environment variable.

The Vercel app reads the API base URL at build time. Keep the Render service available for the frontend to load catalog data.

## Local development

Run the frontend and local JSON Server together with `npm run dev:all`. The API is available at `http://localhost:3001/catalog` and the frontend at the Vite URL printed in the terminal.
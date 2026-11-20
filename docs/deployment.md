# Deployment

This document covers the static production build and the included Docker image.
The application is a client-rendered frontend. It has no backend, authentication,
central database, or server-side persistence.

## Deploy with Docker

Build the image from the repository root:

```sh
docker build -t hamyar-service-dashboard:latest .
```

Run it on a host port:

```sh
docker run --detach --name hamyar-service-dashboard --restart unless-stopped \
  --publish 8080:8080 hamyar-service-dashboard:latest
```

Open `http://localhost:8080`. The Nginx container listens on port 8080 as an
unprivileged user. Its configuration serves the generated Vite assets and
returns `index.html` for application routes, so reloading a nested route works.

To publish a new version, build a new image tag, stop and remove the old
container, then run the new image with the same port mapping. The image contains
only the built static assets and Nginx runtime. Node and development dependencies
are left in the build stage.

For internet-facing deployments, terminate TLS at a trusted reverse proxy or
load balancer and forward traffic to the container's port 8080. Keep the
container port private to that proxy where the hosting platform allows it.

## Deploy the static build

Use Node.js 22.18 or newer for a reproducible project build:

```sh
npm ci
npm run build
```

Publish the contents of `dist/` to a static host. Configure the host to serve
`index.html` for unknown paths while serving existing assets normally. Without
that single-page application fallback, reloading routes such as `/customers`
may return a 404.

## Browser storage and data

The dashboard stores its demo records and preferences in each user's browser
`localStorage`, scoped to the deployed origin. Replacing or restarting the
container does not transfer or back up that browser data. Different browsers,
devices, and origins have separate data. Clearing site data removes it.

This deployment is suitable for the frontend demo. It does not provide shared
accounts, access control, server backups, or production financial records.
Do not enter sensitive customer or payment information.

## Release checks

Before publishing a release, run the repository checks:

```sh
npm run format:check
npm run architecture:check
npm run typecheck
npm test
npm run i18n:check
npm run build
```

Review the image base tags and update dependencies regularly. For controlled
production releases, use reviewed image versions and an immutable image digest
in the deployment platform instead of relying on a mutable tag such as
`latest`.

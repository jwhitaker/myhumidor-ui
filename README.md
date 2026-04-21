# MyHumidor UI

React + TypeScript frontend for the MyHumidor API.

## API contract

This project generates a typed client from:

- `../myhumidor-server/api/api_spec.yaml`

Run API generation anytime the server spec changes:

```bash
npm run generate:api
```

## Environment

Set the backend URL with:

- `VITE_MYHUMIDOR_API_URL`

Default fallback is `http://localhost:8080`.

## Scripts

```bash
npm install
npm run generate:api
npm run dev
```

Other scripts:

```bash
npm run build
npm run lint
npm run preview
```

## Implemented UI behavior

- Fetches humidors from `GET /humidor`
- Shows loading, error with retry, empty, and data states
- Displays `id`, `name`, and optional `description`

# Instant Payment Service API

This project implements a lightweight passthrough API for the Instant Payment Service (IPS) specifications. It exposes ISO20022 XML endpoints using Node.js and Express without any persistence layer.

## Getting started

```bash
npm install
npm run dev
```

The API listens on port `3000` by default. Use the `PORT` environment variable to override it.

## Available scripts

- `npm start` - start the service with Node.
- `npm run dev` - start the service with Nodemon for auto-reloads during development.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/ips-payments/service-requests` | Accepts new payment or non-payment instructions. |
| `PUT` | `/ips-payments/health-checks` | Performs a connectivity health check. |
| `PUT` | `/credit-status` | Receives leg 4 credit status updates. |

All endpoints expect and respond with `application/xml` payloads. When requests are malformed or missing a body the API returns an ISO20022-inspired error envelope.

The OpenAPI contract from the specification is available at [`openapi/instant-payment-service.yaml`](openapi/instant-payment-service.yaml).

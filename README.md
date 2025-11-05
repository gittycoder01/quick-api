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

When an endpoint is invoked with an unsupported HTTP method the service now returns a `405 Method Not Allowed` response describing the expected verb.

The OpenAPI contract from the specification is available at [`openapi/instant-payment-service.yaml`](openapi/instant-payment-service.yaml).

## Example XML payloads

Sample request bodies for each endpoint live in [`examples/`](examples). A
short overview of the payloads and editable fields is available in
[`examples/README.md`](examples/README.md). They can be used directly with
`curl` or any other HTTP client while exercising the passthrough service:

```bash
curl -i \
  -H "Content-Type: application/xml" \
  --data-binary @examples/service-request.xml \
  http://localhost:3000/ips-payments/service-requests

curl -i \
  -H "Content-Type: application/xml" \
  --data-binary @examples/health-check.xml \
  http://localhost:3000/ips-payments/health-checks

curl -i \
  -H "Content-Type: application/xml" \
  --data-binary @examples/credit-status.xml \
  http://localhost:3000/credit-status
```

Feel free to duplicate and edit these files to reflect different scenarios without rebuilding payloads from scratch.

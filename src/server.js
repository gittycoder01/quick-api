const crypto = require('node:crypto');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan('combined'));
const xmlContentTypes = [
  'application/xml',
  'text/xml',
  'application/*+xml',
];

app.use(
  express.text({
    type: xmlContentTypes,
    limit: '5mb',
  }),
);

const xmlType = 'application/xml';

const buildAckResponse = (operation, status = 'received', payload = '') => {
  const timestamp = new Date().toISOString();
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Message>\n  <AppHdr>\n    <Operation>${operation}</Operation>\n    <ResponseTimestamp>${timestamp}</ResponseTimestamp>\n  </AppHdr>\n  <ProcessingStatus>${status}</ProcessingStatus>\n  <OriginalPayloadHash algorithm="SHA-256">${payloadHash}</OriginalPayloadHash>\n</Message>`;
};

const buildErrorResponse = (reasonCode, description) => `<?xml version="1.0" encoding="UTF-8"?>\n<Error>\n  <Errors>\n    <Error>\n      <Source>instant-payment-service</Source>\n      <ReasonCode>${reasonCode}</ReasonCode>\n      <Description>${description}</Description>\n      <Recoverable>false</Recoverable>\n      <Details />\n    </Error>\n  </Errors>\n</Error>`;

const enforceXml = (operation) => (req, res, next) => {
  const isXml = xmlContentTypes.some((type) => req.is(type));
  if (!isXml) {
    return res
      .status(415)
      .type(xmlType)
      .send(
        buildErrorResponse(
          'UNSUPPORTED_MEDIA_TYPE',
          `${operation} expects an application/xml payload.`,
        ),
      );
  }
  return next();
};

const requireBody = (operation) => (req, res, next) => {
  if (!req.body || req.body.trim().length === 0) {
    return res
      .status(400)
      .type(xmlType)
      .send(buildErrorResponse('INVALID_REQUEST', `${operation} requires a non-empty XML payload.`));
  }
  return next();
};

app.post(
  '/ips-payments/service-requests',
  enforceXml('Service request'),
  requireBody('Service request'),
  (req, res) => {
    return res
      .status(200)
      .type(xmlType)
      .send(buildAckResponse('serviceRequest', 'received', req.body));
  },
);

app.put(
  '/ips-payments/health-checks',
  enforceXml('Health check'),
  requireBody('Health check'),
  (req, res) => {
    return res
      .status(200)
      .type(xmlType)
      .send(buildAckResponse('healthCheck', 'healthy', req.body));
  },
);

app.put(
  '/credit-status',
  enforceXml('Credit status update'),
  requireBody('Credit status update'),
  (req, res) => {
    return res
      .status(202)
      .type(xmlType)
      .send(buildAckResponse('serviceResponse', 'accepted', req.body));
  },
);

app.use((req, res) => {
  res.status(404).type(xmlType).send(buildErrorResponse('NOT_FOUND', 'The requested resource was not found.'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .type(xmlType)
    .send(buildErrorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Instant Payment Service API listening on port ${PORT}`);
  });
}

module.exports = app;
app.get('/', (req, res) => {
  res
    .status(200)
    .type(xmlType)
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<ServiceDescription>\n  <Name>Instant Payment Service API</Name>\n  <Version>0.0.6</Version>\n  <Description>Passthrough endpoints for ISO20022 IPS messages.</Description>\n</ServiceDescription>`,
    );
});


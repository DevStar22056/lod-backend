const express = require('express');
const cors = require('cors');
const app = express();
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const config = require('../../config')();
const authMiddleware = require('../auth/authMiddleware');
const {
  init: databaseInit,
  middleware: databaseMiddleware,
} = require('../database/databaseInit');
const path = require('path');
const fs = require('fs');

databaseInit().catch((error) => console.error(error));
app.use(cors({ origin: true }));

const upload = require('./file/upload');
upload.mapAllUploadRequests(
  '/api',
  app,
  databaseMiddleware,
  authMiddleware,
);

const download = require('./file/download');
app.get(
  '/api/download',
  databaseMiddleware,
  authMiddleware,
  download,
);

const stripeWebhooks = require('./webhooks/stripe');
app.use('/webhooks', databaseMiddleware, stripeWebhooks);

app.use(
  '/api',
  databaseMiddleware,
  authMiddleware,
  graphqlHTTP((req) => ({
    schema,
    graphiql: config.graphiql,
    context: {
      currentUser: req.currentUser,
      language: req.headers['accept-language'] || 'en',
    },
    formatError(error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(error);
      }

      return {
        message: error.message,
        code:
          error.originalError && error.originalError.code,
        locations: error.locations,
        path: error.path,
      };
    },
  })),
);

const frontendDir = path.join(
  __dirname,
  '../../../frontend/dist',
);

if (fs.existsSync(frontendDir)) {
  app.use('/', express.static(frontendDir));

  app.get('*', function(request, response) {
    response.sendFile(
      path.resolve(frontendDir, 'index.html'),
    );
  });
}

module.exports = app;

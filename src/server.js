// import 'cronjob/getNews';
import cors from 'cors';
import 'cronjob/updatedb';
import env from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import router from 'routes';
import socketIO from 'socket.io';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connect } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger';

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

env.config();
connect({ io });
// JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static('public'));

// Middleware
app.use(logger);
app.use(cors());

app.get('/', (req, res) => {
  res.send('Green Charity APIs');
});

// Mounted the routes
app.use('/api/v1', router);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Green Charity APIs',
      version: '1.0.0',
      description: 'Green Charity APIs'
    },
    servers: [
      {
        url: 'http://localhost:8080/api/v1'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.all('*', (req, res, next) => {
  const err = new Error('Invalid route');
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Development');
}

const PORT = process.env.PORT || 8080;
// Main app
httpServer.listen(PORT, () => {
  console.log('Server is listening on port:', PORT);
});

import cors from 'cors';
// import 'cronjob/getNews';
import 'cronjob/updatedb';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import env from 'dotenv';
import socketIO from 'socket.io';
import http from 'http';
// Routes
import router from 'routes';
import { connect } from './config/db';
// Error handler
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

// Middleware
app.use(logger);
app.use(cors());

app.get('/', (req, res) => {
  res.send('Green Charity APIs');
});

// Mounted the routes
app.use('/api/v1', router);
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

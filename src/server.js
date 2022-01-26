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
import { connect } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger';

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer, {
  cors: {
    origin: '*'
  }
});

env.config();
connect({ io });

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(logger);
app.use(cors());

app.get('/', (req, res) => {
  res.send('Green Charity APIs');
});

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

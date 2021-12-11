import cors from 'cors';
// import 'cronjob/getNews';
import 'cronjob/updateDb';

import express from 'express';
import helmet from 'helmet';
import { dailyUpdateNews } from 'modules/daily_update_news';
import morgan from 'morgan';
// Routes
import router from 'routes';
import './config/db';
// Error handler
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger';
const app = express();

require('dotenv').config();

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
dailyUpdateNews();
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
app.listen(PORT, () => {
  console.log('Server is listening on port:', PORT);
});

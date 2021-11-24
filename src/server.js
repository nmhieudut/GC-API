import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import './config/db';
// Error handler
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger';
// Routes
import auth from './routes/auth';
import campaign from './routes/campaign';
import comment from './routes/comment';
import user from './routes/user';
import news from './routes/news';
import checkout from '/routes/checkout';
import balance from './routes/balance';
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

// Mounted the routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/campaigns', campaign);
app.use('/api/v1/comments', comment);
app.use('/api/v1/news', news);
app.use('/api/v1/checkout', checkout);
app.use('/api/v1/balance', balance);
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

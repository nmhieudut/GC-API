import chalk from 'chalk';
import winstonLogger from 'config/winston';
const logger = (req, res, next) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    '-' +
    (current_datetime.getMonth() + 1) +
    '-' +
    current_datetime.getDate() +
    ' ' +
    current_datetime.getHours() +
    ':' +
    current_datetime.getMinutes() +
    ':' +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let body = req.body;
  let query = req.query;
  winstonLogger.log({
    level: 'info',
    message: `${chalk.green(method)} ${chalk.blue(url)} ${chalk.yellow(
      formatted_date
    )}, body: ${JSON.stringify(body, null, 2)}, query: ${JSON.stringify(
      query,
      null,
      2
    )}`
  });

  next();
};

export default logger;

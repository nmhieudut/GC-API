import chalk from "chalk";

const logger = (req, res, next) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = process.env.HOST + process.env.PORT + req.url;
  switch (method) {
    case "GET":
      console.log("Request:", `${chalk.green(method)} ${url} `);
      break;
    case "POST":
      console.log("Request:", `${chalk.yellow(method)} ${url} `);
      break;
    case "PUT":
      console.log("Request:", `${chalk.blue(method)} ${url} `);
      break;
    case "DELETE":
      console.log("Request:", `${chalk.red(method)} ${url} `);
      break;
    default:
      console.log("Request:", `${chalk.green(method)} ${url} `);
      break;
  }

  next();
};

export default logger;

import { responseErrorMessage } from 'constants/error';

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || responseErrorMessage.INTERNAL_SERVER_ERROR;
  // Duplicated err
  console.log(err);
  if (err.code === 11000) {
    err.statusCode = 400;
    console.log('-------------', err);
    for (let p in err.keyValue) {
      err.message = `${p} đã được dùng rồi.`;
    }
  }
  // ObjectId not found
  if (err.kind === 'ObjectId') {
    err.statusCode = 404;
    err.message = `The ${req.originalUrl} is not found because of wrong ID`;
  }
  // Validation
  if (err.errors) {
    err.statusCode = 400;
    err.message = [];
    for (let p in err.errors) {
      err.message.push(err.errors[p].properties.message);
    }
  }

  res.status(err.statusCode).json({
    message: err.message
  });
};

export { errorHandler };

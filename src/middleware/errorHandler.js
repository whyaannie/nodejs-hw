import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    message: err.message || "Something went wrong",
  });
};
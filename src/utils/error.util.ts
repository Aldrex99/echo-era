import { Response } from 'express';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const classicFailOrErrorResponse = (message: string, statusCode: number, res: Response) => {
  return res.status(statusCode).json({
    status: 'error',
    message: message
  });
}
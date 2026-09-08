import pinoHttp from 'pino-http';

const logger = pinoHttp({
  transport: {
    target: 'pino-pretty',
  },
});

export default logger;
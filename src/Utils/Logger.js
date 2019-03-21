import winston from 'winston';
import expressWinston from 'express-winston';
import listEndpoints from 'express-list-endpoints';
import Config from 'Config';

const { format } = winston;

const { level, levels, colors } = Config.logger;

winston.addColors(colors);

export const consoleTransport = new winston.transports.Console();

const logger = winston.createLogger({
  transports: [consoleTransport],
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.align(),
    format.printf(info => {
      const { timestamp, level, message, ...extra } = info;

      return `${timestamp} [${level}]: ${message} ${
        Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
      }`;
    })
  ),
  levels,
  level,
});

export const routeLogger = expressWinston.logger({
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  winstonInstance: logger,
  statusLevels: {
    success: 'info',
    warn: 'error',
    error: 'error',
  },
});

export const routeErrorLogger = expressWinston.errorLogger({
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  winstonInstance: logger,
  blacklistedMetaFields: ['stack', 'trace', 'process', 'os'],
});

logger.debug('Logger initialized');

export function logRoutes(app) {
  const endpointList = listEndpoints(app);
  endpointList.forEach(endpoint => {
    endpoint.methods.forEach(method => {
      logger.verbose(`Added ${method} ${endpoint.path}`);
    });
  });
}

export default logger;

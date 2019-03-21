/**
 * Module dependencies.
 */
// eslint-disable-next-line
import http from 'http';
import https from 'https';
import fs from 'fs';
import Config from 'Config';
import Logger from 'Utils/Logger';
import app from './app';

const { port: configPort, useHTTPS, baseURL, sslKeyPath, sslCertPath } = Config.server;

if (useHTTPS) {
  Logger.info('Using HTTPS');
}

/**
 * Get port from config and store in Express.
 */

if (!configPort) {
  Logger.warn('Port is not defined in config!');
}

const port = useHTTPS ? 443 : configPort || '1337';
app.set('port', port);
Logger.debug(`App starting on port: ${port}`);

/**
 * Create HTTP server.
 */

const server = useHTTPS
  ? https.createServer(
      { key: fs.readFileSync(sslKeyPath), cert: fs.readFileSync(sslCertPath) },
      app
    )
  : http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCESS':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};
server.on('error', onError);

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  Logger.info(`Server address: ${baseURL}:${port}`);
  Logger.info(`Listening on ${bind}`);
};

server.on('listening', onListening);

const initApp = async () => {
  Logger.info('Initializing app');
  // initialize database, other services
  // try {
  //   Logger.info('  Database connection initialized');
  // } catch (err) {
  //   Logger.error('  Error while initializing database: %o', err);
  // }
  Logger.info('App initialized');
};

Logger.debug('Pre app init');
initApp().then(() => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port, 'localhost');
});

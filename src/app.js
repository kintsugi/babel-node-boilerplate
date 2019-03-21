import express from 'express';
import cookieParser from 'cookie-parser';
import Logger, { routeLogger, routeErrorLogger, logRoutes } from 'Utils/Logger';

Logger.debug('Bootstrapping app');

const app = express();

Logger.verbose('Adding app routes');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(routeLogger);

app.get('/', (_, res) => {
  res.send('Hello World!');
});

logRoutes(app);

app.use(routeErrorLogger);
app.use(err => {
  console.error(err);
});

Logger.debug('Express app ready');
export default app;

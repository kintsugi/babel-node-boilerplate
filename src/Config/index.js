import environments from './environments';

// Import all config files here
import server from './server';
import logger from './logger';

// List all config objects imported here
const config = {
  server,
  logger,
};

// config settings in environmen files override original values
Object.entries(environments).forEach(([key, value]) => {
  config[key] = {
    ...config[key],
    ...value,
  };
});

export default config;

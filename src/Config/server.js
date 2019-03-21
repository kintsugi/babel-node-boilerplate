import path from 'path';

const sslDir = path.join(__dirname, '../../ssl');

const formatSslPath = sslPath => {
  // don't format if the path is absolute
  if (sslPath.startsWith('/')) {
    return sslPath;
  }
  return path.join(sslDir, sslPath);
};

export default {
  // if using https
  // port: '443',
  // useHTTPS: true,
  // baseURL: 'https://localhost',
  port: '3000',
  useHTTPS: false,
  baseURL: 'http://localhost',
  sslKeyPath: formatSslPath(process.env.SSL_KEY_PATH || ''),
  sslCertPath: formatSslPath(process.env.SSL_CERT_PATH || ''),
};

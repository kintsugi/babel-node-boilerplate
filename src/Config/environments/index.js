import development from './development';
import production from './production';

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export default (ENVIRONMENT === 'development' ? development : production);

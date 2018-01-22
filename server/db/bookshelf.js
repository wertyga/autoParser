import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from '../../knexfile';

const env = process.env.NODE_ENV.trim() || 'development';

export default bookshelf(knex(knexConfig[env]));
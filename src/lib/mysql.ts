import { Sequelize } from 'sequelize';

import { env } from '@/env';

const db = new Sequelize({
  dialect: 'mysql',
  host: env.DB_HOST,
  port: 3306, // Adjust if needed
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  logging: true, // Set to true for debugging
});

export default db;

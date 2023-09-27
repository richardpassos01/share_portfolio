import dotenv from 'dotenv';

const dotenvConfigPath = '.env.test';
dotenv.config({ path: dotenvConfigPath });

export default {
  rootDir: '.',
  roots: ['<rootDir>/tests'],
};

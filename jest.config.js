import dotenv from 'dotenv';

const dotenvConfigPath = '.env.test';
dotenv.config({ path: dotenvConfigPath });

export default {
  testTimeout: 1500,
  rootDir: '.',
  roots: ['<rootDir>/tests'],
};

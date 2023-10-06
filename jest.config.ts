import type { JestConfigWithTsJest } from 'ts-jest'
const dotenv = require('dotenv');

const dotenvConfigPath = '.env.test';
dotenv.config({ path: dotenvConfigPath });

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@config': '<rootDir>/src/config/index',
    '^@helpers': '<rootDir>/src/helpers/index',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@dependencyInjectionContainer': '<rootDir>/src/DependencyInjectionContainer',
    '^@factories/(.*)$': '<rootDir>/tests/factories/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testTimeout: 1500,
  rootDir: '.',
};

export default jestConfig;

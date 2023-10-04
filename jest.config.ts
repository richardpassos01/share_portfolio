import dotenv from 'dotenv';

const dotenvConfigPath = '.env.test';
dotenv.config({ path: dotenvConfigPath });

export default {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@factories/(.*)$': '<rootDir>/test/factories/$1',
    '^@settings': '<rootDir>/src/settings/index',
    '^@dependencyInjectionContainer': '<rootDir>/src/DependencyInjectionContainer',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testTimeout: 1500,
  rootDir: '.',
  roots: ['<rootDir>/tests'],
};

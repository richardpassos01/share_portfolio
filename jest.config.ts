import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

import dotenv from 'dotenv';

const dotenvConfigPath = '.env.test';
dotenv.config({ path: dotenvConfigPath });

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__test__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  roots: ['<rootDir>/test'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testTimeout: 1500,
  rootDir: '.',
};

export default jestConfig;

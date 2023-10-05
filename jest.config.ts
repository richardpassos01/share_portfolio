import { pathsToModuleNameMapper } from 'ts-jest'
import type { JestConfigWithTsJest } from 'ts-jest'
import config from './tsconfig.json'
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
  modulePaths: ['.'],
  moduleNameMapper: pathsToModuleNameMapper(config.compilerOptions.paths),
};

export default jestConfig;

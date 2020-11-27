require('./env.js');

/**
 * @see https://stackoverflow.com/questions/50171412/jest-typescript-absolute-paths-baseurl-gives-error-cannot-find-module
 */
function makeModuleNameMapper(srcPath, tsconfigPath) {
  // Get paths from tsconfig
  const { paths } = require(tsconfigPath).compilerOptions;

  const aliases = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '/(.*)');
    const path = paths[item][0].replace('/*', '/$1');
    aliases[key] = srcPath + '/' + path;
  });
  return aliases;
}

const TS_CONFIG_PATH = './tsconfig.json';
const SRC_PATH = '<rootDir>/';

module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'd.ts', 'json', 'node'],
  moduleDirectories: ['__tests__', 'node_modules'],
  moduleNameMapper: {
    common: '<rootDir>/common/',
    features: '<rootDir>/features/',
    theme: '<rootDir>/features/theme/',
    pages: '<rootDir>/pages/',
    services: '<rootDir>/services/',
    utils: '<rootDir>/utils/',
    types: '<rootDir>/types/',
  },
  transform: {
    '^.+\\.(ts|tsx)?$': 'babel-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  testMatch: ['**/*.test.(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: [
    /** Dist Folder */
    '<rootDir>/.next/',
    '<rootDir>/.now/',
    '<rootDir>/_docs/',
    '<rootDir>/out/',
    /** External Services */
    '<rootDir>/.gitlab/',
    '<rootDir>/.firebase/',
    '<rootDir>/functions/',
    '<rootDir>/firestore/',
    /** Deps */
    '<rootDir>/node_modules/',
  ],
  coveragePathIgnorePatterns: [
    /** Dist Folder */
    '<rootDir>/.next/',
    '<rootDir>/.now/',
    '<rootDir>/_docs/',
    '<rootDir>/out/',
    /** External Services */
    '<rootDir>/.gitlab/',
    '<rootDir>/.firebase/',
    '<rootDir>/functions/',
    '<rootDir>/firestore/',
    /** Deps */
    '<rootDir>/node_modules/',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js',
  },
  setupFilesAfterEnv: ['<rootDir>/utils/setup-tests.tsx'],
};

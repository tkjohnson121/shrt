require('./env.js');

module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'd.ts', 'json', 'node'],
  moduleDirectories: ['__tests__', 'node_modules', '.'],
  moduleNameMapper: {
    common: ['<rootDir>/common/'],
    features: ['<rootDir>/features/'],
    theme: ['<rootDir>/features/theme'],
    pages: ['<rootDir>/pages/'],
    services: ['<rootDir>/services/'],
    utils: ['<rootDir>/utils'],
    types: ['<rootDir>/types/'],
    '\\.(jpg|jpeg|png|svg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js',
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
  setupFilesAfterEnv: ['<rootDir>/utils/setup-tests.tsx'],
};

require('dotenv').config({ path: './.env.test' });

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  transformIgnorePatterns: ['node_modules/(?!(three|unist-.*|hast-.*|rehype-slug)/)'], // force JEST to process this module
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/mocks/fileMock.js',
    '\\.(css|less)$': '<rootDir>/src/mocks/fileMock.js'
  },
  coverageReporters: ['json', 'html'],
  setupFilesAfterEnv: ['./src/jest-setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      isolatedModules: true
    }
  }
};

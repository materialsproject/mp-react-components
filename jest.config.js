require('dotenv').config({ path: './.env.test' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  setupFiles: ['./src/jest-setup.ts']
};

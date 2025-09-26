require('dotenv').config({ path: './.env.test' });

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  /**
   * Tell jest to ignore transforming most node_modules
   * except for the ones that match the module strings listed here.
   * This is necessary for node modules that distribute their source code as uncompiled JS.
   */
  transformIgnorePatterns: [
    'node_modules/(?!(three|unist-.*|hast-.*|rehype-slug|remark-rehype|react-markdown|vfile.*|unified|bail|is-plain-obj|trough|remark-parse|mdast-.*|micromark.*|decode-named-character-reference|unist-.*|character-entities|property-information|space-separated-tokens|comma-separated-tokens)/)'
  ],
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

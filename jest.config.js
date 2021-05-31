module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  setupFilesAfterEnv: [
    `${__dirname}/config/jest/setupTests.js`,
  ],
  testMatch: [
    `${__dirname}/src/**/unit.test.{js,jsx,mjs}`,
  ],
  transform: {
    '^.+\\.css$': `${__dirname}/config/jest/cssTransform.js`,
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': `${__dirname}/config/jest/fileTransform.js`,
    '^.+\\.(js|jsx)$': `${__dirname}/config/jest/jestPreprocess.js`,
  },
  transformIgnorePatterns: [
    '/node_modules\\/(?![lit\\-element|lit\\-html])/',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
  ],
};

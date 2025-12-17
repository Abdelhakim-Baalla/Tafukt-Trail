module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testMatch: ['**/tests/unit/**/*.test.js'],
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/src/tests/integration']
};

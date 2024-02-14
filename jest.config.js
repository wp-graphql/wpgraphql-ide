module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    "**/tests/unit/**/*.js",
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};

module.exports = {
  // Use the default Create React App Jest configuration
  preset: "react-scripts",

  // Test environment for React components
  testEnvironment: "jsdom",

  // Setup files to run before tests
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  // Transform ES modules from node_modules
  transformIgnorePatterns: ["node_modules/(?!(axios)/)"],

  // Module name mapping for static assets
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
  },

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/setupTests.js",
    "!src/**/*.test.js",
  ],

  // Coverage thresholds (optional)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },

  // Setup files after environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Test match patterns
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],

  // Module name mapping for absolute imports
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Coverage settings
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/node_modules/**",
  ],

  // Coverage directory
  coverageDirectory: "coverage",

  // Coverage reporters
  coverageReporters: ["text", "lcov", "html"],

  // Coverage provider
  coverageProvider: "v8",

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Ignore patterns for test paths
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],

  // Verbose output
  verbose: true,
};

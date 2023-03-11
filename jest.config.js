module.exports = {
    roots: ["<rootDir>"],
    testMatch: ["<rootDir>/src/**/*.{ts,tsx}"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    moduleNameMapper: {
      "^@components/(.*)$": "<rootDir>/src/components/$1",
      "^@config$": "<rootDir>/src/config.ts",
      "^@styles/(.*)$": "<rootDir>/src/styles/$1",
      "^@utils/(.*)$": "<rootDir>/src/utils/$1"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
  };
  
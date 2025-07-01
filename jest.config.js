module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babel.config.test.js" },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|@radix-ui)/)",
    "/.next/",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "babel.config.test.js"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};

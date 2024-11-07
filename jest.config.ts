import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

const esModules = ["@globus/sdk"].join("|");

const generateConfig = async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})/`],
});

export default generateConfig;

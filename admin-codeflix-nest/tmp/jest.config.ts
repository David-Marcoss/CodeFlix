import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.interface.ts',
    '-interface.ts',
    'shared/testing',
    'shared-module/testing',
    'validator-rules.ts',
    '-fixture.ts',
    '.input.ts',
    '.d.ts',
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.?([mc])[jt]s?(x)',
    '**/?(*.)+(spec|test).?([mc])[jt]s?(x)',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Allow TS files to import compiled JS extension paths (e.g. `./file.js`)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
          },
          target: 'es2021',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  // Allow ESM-only deps like `uuid` to be transformed to CJS for Jest.
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)', '\\.pnp\\.[^\\/]+$'],
  setupFilesAfterEnv: ['./src/shared/infra/testing/expect-helpers.ts'],
};

export default config;

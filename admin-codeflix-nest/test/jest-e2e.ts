import { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageProvider: 'v8',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            decoratorMetadata: true,
          },
          target: 'es2023',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  setupFilesAfterEnv: ['./setup-jest-e2e.ts'],
};

export default config;

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "<rootDir>/jest.environment.cjs",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  moduleNameMapper: {
    // Intercept jsdom's fetch directly instead of Node's native socket layer.
    "^@mswjs/interceptors/fetch$": "@mswjs/interceptors/fetch/web",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs/interceptors|@msw/url|@open-draft/until|until-async|rettime|cookie)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["<rootDir>/src/**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.(?:[tj]sx?|mjs)$": [
      "babel-jest",
      {
        // MSW's Node interceptor uses import.meta.url to locate its WASM asset.
        plugins: [function nodeImportMeta({ types }) {
          return {
            visitor: {
              MetaProperty(path, state) {
                if (path.node.meta.name === "import") {
                  path.replaceWith(types.objectExpression([
                    types.objectProperty(
                      types.identifier("url"),
                      types.stringLiteral(require("node:url").pathToFileURL(state.filename).href),
                    ),
                  ]));
                }
              },
            },
          };
        }],
        presets: [
          ["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
      },
    ],
  },
  clearMocks: true,
}

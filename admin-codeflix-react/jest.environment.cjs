const { TestEnvironment } = require("jest-environment-jsdom");

// Preserve Node's web APIs before Jest creates the jsdom sandbox.
const webAPIs = {
  fetch,
  Request,
  Response,
  Headers,
  FormData,
  AbortController,
  AbortSignal,
  ReadableStream,
  WritableStream,
  TransformStream,
  BroadcastChannel,
};

module.exports = class extends TestEnvironment {
  async setup() {
    await super.setup();
    Object.assign(this.global, webAPIs);
  }
};
